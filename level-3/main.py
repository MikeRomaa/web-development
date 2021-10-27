"""
Michael Romashov
Web Development - Section 83
October 14th, 2021

I have created what I think is a pretty fair seating system for aircraft.
This happens in 3 steps:
    1. I assign half of the passengers to random seats
    2. I assign the relatives (same family #) of passengers to seats near their family members.
    3. I assign the rest of the passengers to random seats

When randomly assigning passengers in the first round, I skip odd
columns to allow for space that can seat family members. These odd
columns get filled in by relatives and later other passengers.

The program consists of an Aircraft class that contains all of the
variables and methods necessary to simulate aircraft seating. All
logic relating to passenger and family generation is contained in
this main.py file.
"""
import math
import random

from airplane import Aircraft


MAX_FAMILY_SIZE = 5
FAMILY_NUM = 1


aircraft = Aircraft(20, 5, 4)  # 20 rows, 5 columns, first 4 rows are premium

# premium_passengers and economy_passengers will keep track of how many more passengers
# we need to seat in each class. This will be decremented each time someone is seated.

premium_load_factor = random.randint(4, 9) / 10  # Premium class is 40% - 90% full
premium_passengers = math.floor(aircraft.vacant_premium_seats * premium_load_factor)

economy_load_factor = random.randint(7, 10) / 10  # Economy class is 70% - 100% full
economy_passengers = math.floor(aircraft.vacant_economy_seats * economy_load_factor)

# Assign first half of the premium passengers to random seats,
# odd columns are skipped to accomodate family members if they appear.
for i in range(premium_passengers // 2):
    seat = aircraft.get_random_seat(
        row_end=aircraft.premium_rows,
        skip_odd=True,
    )
    aircraft.assign_seat(*seat, FAMILY_NUM)
    premium_passengers -= 1
    FAMILY_NUM += 1

# Assign first half of the economy passengers to random seats,
# odd columns are skipped to accomodate familiy members if they appear.
for i in range(economy_passengers // 2):
    seat = aircraft.get_random_seat(
        row_start=aircraft.premium_rows,
        row_end=aircraft.rows,
        skip_odd=True,
    )
    aircraft.assign_seat(*seat, FAMILY_NUM)
    economy_passengers -= 1
    FAMILY_NUM += 1

# Go through all the family numbers with a 60% chance to create
# a family of up to MAX_FAMILY_SIZE people. These family members
# will be seated in the cloesest seat to another family member
# on the aircraft.
for i in range(FAMILY_NUM - 1):
    if random.randint(0, 6) == 0:
        family_size = min(random.randint(0, MAX_FAMILY_SIZE - 1), FAMILY_NUM)
        for _ in range(family_size):
            row, col = aircraft.get_family_seat(i + 1)
            aircraft.assign_seat(row, col, i + 1)
            if row < aircraft.premium_rows:
                premium_passengers -= 1
            else:
                economy_passengers -= 1

# Assign the remaining premium passengers to random seats.
for i in range(premium_passengers):
    aircraft.assign_seat(*aircraft.get_random_premium_seat(), FAMILY_NUM)
    FAMILY_NUM += 1

# Assign the remaining economy passengers to random seats.
for i in range(economy_passengers):
    aircraft.assign_seat(*aircraft.get_random_economy_seat(), FAMILY_NUM)
    FAMILY_NUM += 1

print(aircraft)
