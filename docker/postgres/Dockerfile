FROM postgres:17-alpine

ENV POSTGRES_DB=shortener \
    POSTGRES_USER=shortener \
    POSTGRES_PASSWORD=shortener

VOLUME /var/lib/postgresql/data

HEALTHCHECK --interval=5s --timeout=3s --retries=10 \
  CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1

EXPOSE 5432
