FROM python:3.11

COPY ./requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt
COPY app.py /app/app.py
WORKDIR /app
EXPOSE 8000

COPY go.sh /app/go.sh

ENTRYPOINT ["bash", "go.sh"]
