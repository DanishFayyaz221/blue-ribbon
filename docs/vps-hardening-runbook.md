# VPS Hardening & Setup Runbook — Phase 0 + Phase 1

Target: `187.124.212.156` (Hostinger KVM 4, Ubuntu 24.04 LTS, UK–Manchester)
Purpose: prepare the box to receive the Reapit/Agentbox REAXML feed and host the site.

**Authorisation required.** This server belongs to Blue Ribbon Real Estate. Get Manish's
explicit approval before running anything here — several steps change SSH access and
could lock out other people who use this box.

---

## Before you start

1. **Confirm who else has root.** Disabling password authentication cuts off anyone
   relying on the root password. Ask before, not after.
2. **Open two SSH sessions.** Do all work in session A. Leave session B connected and
   untouched — it is the way back in if a change breaks login.
3. Confirm nothing else is running that matters. Panel showed 3 GB used and 5% memory,
   so the box should be effectively empty.

```bash
free -h
df -h
ss -tlnp          # what is currently listening
```

---

## 1. SSH access — key first, then lock down

**Order matters.** Add and *verify* the key before disabling password login. Reversing
these two steps locks you out permanently.

From your local machine:

```bash
ssh-keygen -t ed25519
ssh-copy-id root@187.124.212.156
```

Create a non-root admin user:

```bash
adduser --disabled-password --gecos "" brops
usermod -aG sudo brops
install -d -m 700 -o brops -g brops /home/brops/.ssh
cp /root/.ssh/authorized_keys /home/brops/.ssh/
chown brops:brops /home/brops/.ssh/authorized_keys
chmod 600 /home/brops/.ssh/authorized_keys
```

Give `brops` passwordless sudo (no password is set, so sudo would otherwise be unusable):

```bash
echo "brops ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/brops
chmod 440 /etc/sudoers.d/brops
visudo -c
```

**Verify from a third terminal before continuing:**

```bash
ssh brops@187.124.212.156 'sudo whoami'   # must print: root
```

Only once that works, harden sshd:

```bash
cat > /etc/ssh/sshd_config.d/99-hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
EOF

sshd -t && systemctl reload ssh
```

`sshd -t` validates the config. If it fails, **do not reload** — fix the file first.

---

## 2. Firewall

The Hostinger panel showed **0 firewall rules**. Every port is currently open to the
internet. Do this before installing MongoDB.

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose
```

Port 27017 is deliberately absent. MongoDB binds to localhost only (§7) and must never
be reachable externally — internet-exposed MongoDB is among the most reliably breached
services there is.

Once Reapit provides Agentbox's egress IP range, tighten SSH:

```bash
ufw delete allow 22/tcp
ufw allow from <AGENTBOX_RANGE> to any port 22 proto tcp
ufw allow from <OFFICE_IP> to any port 22 proto tcp
```

---

## 3. fail2ban

```bash
apt update && apt install -y fail2ban
cat > /etc/fail2ban/jail.local <<'EOF'
[sshd]
enabled = true
maxretry = 5
bantime = 1h
findtime = 10m
EOF
systemctl enable --now fail2ban
fail2ban-client status sshd
```

---

## 4. Feed user, chrooted outside the web root

Reapit currently pushes to `/var/www/html` — the public web root. REAXML files contain
vendor names, contact details, addresses and price expectations, so anything landing
there is publicly downloadable. It also means the feed account can write to a directory
the web server executes from, which is a code-execution path.

**First, check whether files already landed:**

```bash
ls -la /var/www/html/
```

If any `.xml` files are present, treat that data as exposed, tell Manish, and remove
them once noted.

Create the new structure. The chroot parent **must be root-owned and not writable by the
feed user** — sshd refuses the chroot otherwise, and this is the single most common
reason SFTP chroot fails:

```bash
install -d -m 755 -o root  -g root      /srv/reapit-feed
install -d -m 755 -o root  -g root      /srv/blueribbon

id -u reapitfeed >/dev/null 2>&1 || \
  useradd --system --home-dir /srv/reapit-feed --shell /usr/sbin/nologin reapitfeed

install -d -m 750 -o reapitfeed -g reapitfeed /srv/reapit-feed/incoming
install -d -m 750 -o reapitfeed -g reapitfeed /srv/reapit-feed/processed
install -d -m 750 -o reapitfeed -g reapitfeed /srv/reapit-feed/failed
install -d -m 755 -o brops      -g brops      /srv/blueribbon/media
```

Set a new strong password (the feed uses password auth — Reapit's setup form takes a
password, not a key):

```bash
openssl rand -base64 24        # record this, it goes to Reapit
passwd reapitfeed
```

Restrict the account to SFTP inside its chroot:

```bash
cat > /etc/ssh/sshd_config.d/98-reapit-sftp.conf <<'EOF'
Match User reapitfeed
    ChrootDirectory /srv/reapit-feed
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    PasswordAuthentication yes
EOF

sshd -t && systemctl reload ssh
```

`PasswordAuthentication yes` inside the `Match` block re-enables it for this account
only — the global `no` from §1 still applies to everyone else.

Verify from your local machine:

```bash
sftp reapitfeed@187.124.212.156
# should land in / (which is really /srv/reapit-feed) and see incoming/
```

**Paths change from the feed's perspective.** Because of the chroot, Reapit's target
directory is `/incoming`, not `/srv/reapit-feed/incoming`.

---

## 5. Tell Reapit — do not skip

Reply on the existing support thread with:

- **Target Directory:** `/incoming`
- **FTP Username:** `reapitfeed`
- **FTP Password:** the new one from §4
- Transport SFTP, port 22, no explicit TLS (unchanged)

The old `deploy` / `/var/www/html` configuration must be replaced. Change the server
without telling them and the feed silently stops.

Then disable the old account:

```bash
usermod -L deploy && usermod -s /usr/sbin/nologin deploy
```

---

## 6. Swap

16 GB is ample, but 2 GB of swap is cheap insurance against a `next build` spike
colliding with mongod.

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
sysctl -w vm.swappiness=10
echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
```

---

## 7. MongoDB 8.0

Ubuntu's own `mongodb` package is the old unofficial fork. Use MongoDB's repo.

```bash
apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
  | gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" \
  > /etc/apt/sources.list.d/mongodb-org-8.0.list
apt update && apt install -y mongodb-org
```

Configure. The cache cap matters: mongod otherwise claims ~50% of RAM (≈7.5 GB here),
which it does not need for this dataset and which would squeeze the Next.js build.

```bash
cat > /etc/mongod.conf <<'EOF'
storage:
  dbPath: /var/lib/mongodb
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1
security:
  authorization: enabled
EOF

systemctl enable --now mongod
```

Create users. Run *before* clients connect — with `authorization: enabled` and no users
yet, Mongo allows local socket creation of the first user only.

```bash
mongosh <<'EOF'
use admin
db.createUser({
  user: "admin",
  pwd: passwordPrompt(),
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
})
use blueribbon
db.createUser({
  user: "blueribbon",
  pwd: passwordPrompt(),
  roles: [{ role: "readWrite", db: "blueribbon" }]
})
EOF
```

Confirm it is not externally reachable:

```bash
ss -tlnp | grep 27017      # must show 127.0.0.1:27017, never 0.0.0.0:27017
```

---

## 8. Node 22 + build tooling

Ubuntu 24.04's apt Node is too old for Next 16.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs build-essential
npm install -g yarn pm2
node -v && yarn -v
```

Install jemalloc. The Next.js self-hosting guide warns that sharp's image optimisation
can consume excessive memory on glibc systems without it:

```bash
apt install -y libjemalloc2
```

It is preloaded into the **Next.js process only** (see §9). Do not preload it globally —
MongoDB ships its own allocator.

---

## 9. nginx + TLS + app service

```bash
apt install -y nginx
snap install --classic certbot && ln -sf /snap/bin/certbot /usr/bin/certbot
```

**DNS must point `blueribbonrealestate.com.au` at this IP before certbot will issue.**
Verify first:

```bash
dig +short www.blueribbonrealestate.com.au
```

nginx site config:

```nginx
server {
    listen 80;
    server_name blueribbonrealestate.com.au www.blueribbonrealestate.com.au;

    client_max_body_size 10m;

    # Downloaded listing images, served straight off disk.
    location /media/ {
        alias /srv/blueribbon/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";

        # Required for React streaming / Suspense. Without this nginx buffers
        # the response and the whole page arrives at once.
        proxy_buffering off;
    }
}
```

```bash
nginx -t && systemctl reload nginx
certbot --nginx -d blueribbonrealestate.com.au -d www.blueribbonrealestate.com.au
```

PM2 for the app, with the drain period the Next.js docs recommend so in-flight requests
and `after()` callbacks finish on restart:

```bash
pm2 start "yarn start" --name blueribbon \
  --kill-timeout 30000 \
  --node-args="--max-old-space-size=2048"
pm2 env 0    # confirm LD_PRELOAD below is applied
pm2 save && pm2 startup
```

Set `LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2` in the PM2 ecosystem file
for this process.

---

## 10. Backups

The panel shows one snapshot and no automated daily backups. A snapshot is a full-disk
image, not point-in-time database recovery, so `mongodump` is the real backup.

```bash
install -d -m 750 /srv/backups
cat > /usr/local/bin/br-backup.sh <<'EOF'
#!/bin/bash
set -euo pipefail
STAMP=$(date +%F-%H%M)
mongodump --uri="mongodb://blueribbon:PASSWORD@127.0.0.1:27017/blueribbon?authSource=blueribbon" \
  --archive="/srv/backups/blueribbon-$STAMP.gz" --gzip
find /srv/backups -name 'blueribbon-*.gz' -mtime +14 -delete
EOF
chmod 700 /usr/local/bin/br-backup.sh
echo "0 3 * * * root /usr/local/bin/br-backup.sh" > /etc/cron.d/br-backup
```

**Copy backups off this box** — a backup on the same disk does not survive the failure
it exists for. And restore one into a scratch database once; an untested backup is not
a backup.

---

## 11. Verification checklist

- [ ] `ssh root@...` refused; `ssh brops@...` works with key
- [ ] `ufw status` — only 22/80/443 open
- [ ] `ss -tlnp | grep 27017` — bound to `127.0.0.1` only
- [ ] `sftp reapitfeed@...` lands in chroot, can write to `incoming/`
- [ ] `/var/www/html` checked for leaked XML; cleaned if present
- [ ] Reapit notified of new username, password and `/incoming` path
- [ ] `deploy` account disabled
- [ ] `dig` resolves domain to this IP; certbot issued
- [ ] `mongosh` authenticates as `blueribbon`
- [ ] `br-backup.sh` runs clean and a restore has been tested

---

## Still owned by Blue Ribbon, not us

- Email `support@agentbox.com.au` requesting a **full re-export for Agency ID BRB04**.
  The feed only fires on create/update, so existing listings never arrive otherwise and
  the site launches empty. This is the slowest item — send it first.
- Tick **Export to Portals** on a listing (bottom of the General tab) and save, to
  produce the first real file.
- Tell the property management team as well as sales, or rentals never appear.
- Ask Reapit the once-off setup fee amount and who pays it.
