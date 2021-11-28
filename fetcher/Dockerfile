FROM python:3-alpine

RUN apk update && apk upgrade
RUN python -m pip install -qq --upgrade pip
RUN rm -rf \
      /usr/share/man/* \
      /usr/includes/* \
      /var/cache/apk/*

RUN adduser -D app
RUN mkdir -p /app; chown app:app /app

WORKDIR /app
USER app

COPY --chown=app:app requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=app:app . .

CMD ["python", "-u", "runner.py"]
