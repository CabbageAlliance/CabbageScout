FROM python:3.7-slim

WORKDIR /usr/src/app

COPY wait-for-it.sh ./

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY main.py ./
COPY cabbagescout ./cabbagescout

CMD ["./wait-for-it.sh", "database:5432", "--", "python", "main.py"]