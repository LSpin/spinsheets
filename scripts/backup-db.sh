#!/bin/bash
# VtM Character Sheet — PostgreSQL backup script
# Usage: ./scripts/backup-db.sh
# Set up as a cron job: crontab -e
#   0 3 * * * /Users/lspin/workspace/vtm\ sheet/scripts/backup-db.sh

set -euo pipefail

DB_NAME="vtm_db"
BACKUP_DIR="/Users/lspin/workspace/vtm sheet/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/vtm_db_${TIMESTAMP}.sql.gz"
KEEP_DAYS=30

mkdir -p "$BACKUP_DIR"

pg_dump "$DB_NAME" | gzip > "$BACKUP_FILE"

# Remove backups older than $KEEP_DAYS days
find "$BACKUP_DIR" -name "vtm_db_*.sql.gz" -mtime +${KEEP_DAYS} -delete

echo "Backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
