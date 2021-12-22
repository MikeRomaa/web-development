import json
import random
import sys

from enum import Enum
from faker import Faker


class Plan(Enum):
    SUCKER = 0
    BASIC = 1
    COMPREHENSIVE = 2
    UNLIMITED = 3


fake = Faker()
data = []


for _ in range(int(sys.argv[1])):
    msisdn = fake.msisdn()
    data.append({
        'name': fake.name(),
        'phone': f'({msisdn[3:6]}) {msisdn[6:9]}-{msisdn[9:12]}',
        'plan': random.choice(list(Plan)).value,
        'usage': random.randint(1, 40000),
    })


with open('data.json', 'w') as f:
    json.dump(data, f)
