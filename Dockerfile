FROM python:3.7-alpine

# fetcher
RUN adduser -S fetcher
WORKDIR /fetcher
COPY ./fetcher/requirements.txt ./
RUN pip install -r requirements.txt
COPY ./fetcher/ ./

CMD python run.py
