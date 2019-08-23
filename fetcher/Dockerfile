FROM python:3.7-alpine

WORKDIR /fetcher
COPY ./requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

CMD ["python", "-u", "run.py"]
