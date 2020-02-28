FROM python:3.7-slim

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY main.py ./
COPY cabbagescout ./cabbagescout

CMD ["python", "main.py"]