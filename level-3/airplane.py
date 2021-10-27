import random


class Aircraft:
    """
    Instance Variables:
        rows: int - number of rows in the plane
        cols: int - number of columns in the plane
        premium_rows: int - number of rows that are premium economy seats
        plane: int[][] - matrix containing seated family numbers, 0 == empty seat
    """
    def __init__(self, rows, cols, premium_rows):
        self.rows = rows
        self.cols = cols
        self.premium_rows = premium_rows
        self.plane = [[0 for _ in range(cols)] for _ in range(rows)]

    def __str__(self):
        rows = [''.join([(str(seat) if seat != 0 else '').ljust(5) for seat in row]) for row in self.plane]
        string = ''
        for i, row in enumerate(rows):
            row_number = str(i + 1).rjust(len(str(self.rows)))
            string += f'{row_number} {"P" if i < self.premium_rows else "E"} | {row}\n'
        return string

    @property
    def vacant_seats(self):
        """
        Returns how many total seats are available.
        """
        count = 0
        for row in range(self.rows):
            for seat in self.plane[row]:
                if seat == 0:
                    count += 1
        return count

    @property
    def vacant_premium_seats(self):
        """
        Returns how many premium seats are available.
        """
        count = 0
        for row in range(self.premium_rows):
            for seat in self.plane[row]:
                if seat == 0:
                    count += 1
        return count

    @property
    def vacant_economy_seats(self):
        """
        Returns how many economy seats are available.
        """
        count = 0
        for row in range(self.premium_rows, self.rows - self.premium_rows):
            for seat in self.plane[row]:
                if seat == 0:
                    count += 1
        return count

    def find_family_members(self, family):
        """
        Returns a list of all seated family members with the given ID.
        """
        members = []
        for row in range(self.rows):
            for seat in range(self.cols):
                if self.plane[row][seat] == family:
                    members.append((row, seat))
        return members

    def get_family_seat(self, family):
        """
        Returns the nearest seat to a family member with the same ID.
        """
        family = self.find_family_members(family)
        for row, seat in family:
            if seat == 0 and self.plane[row][seat + 1] == 0:
                return row, seat + 1
            if seat == self.cols - 1 and self.plane[row][seat - 1] == 0:
                return row, seat - 1
        near_family = [self.get_closest_seat(*seat) for seat in family]
        # NOTE: Possible optimization - find seat w/ shortest distance
        return near_family[0]

    def get_closest_seat(self, row, col):
        """
        Returns the closest vacant seat to the given seat.
        """
        assert self.vacant_seats > 0

        d_row = 0
        d_col = 0
        while True:
            if col + d_col < self.cols and self.plane[row][col + d_col] == 0:
                return row, col + d_col
            if col - d_col >= 0 and self.plane[row][col - d_col] == 0:
                return row, col - d_col
            if row + d_row < self.rows and self.plane[row + d_row][col] == 0:
                return row + d_row, col
            if row - d_row >= 0 and self.plane[row - d_row][col] == 0:
                return row - d_row, col
            d_row += 1
            d_col += 1

    def get_random_seat(self, row_end, row_start=0, skip_odd=False):
        """
        Returns a tuple representing a random vacant seat (row, column).
            skip_odd: bool - if True, will skip odd numbered columns
        """
        assert self.vacant_seats > 0
        # Select random row
        row = -1
        while row < 0:
            i = random.randint(row_start, row_end - 1)
            if skip_odd:
                row_list = [seat for col, seat in enumerate(self.plane[i]) if col % 2 == 0]
            else:
                row_list = self.plane[i]
            if row_list.count(0):
                row = i
        # Select random seat
        seat = -1
        while seat < 0:
            if skip_odd:
                i = random.randrange(0, self.cols, 2)
            else:
                i = random.randint(0, self.cols - 1)
            if not self.plane[row][i]:
                seat = i
        return row, seat

    def get_random_premium_seat(self):
        """
        Returns a tuple (row, column) representing a random vacant premium seat.
        """
        assert self.vacant_premium_seats > 0
        return self.get_random_seat(row_end=self.premium_rows)

    def get_random_economy_seat(self):
        """
        Returns a tuple (row, column) representing a random vacant economy seat.
        """
        assert self.vacant_economy_seats > 0
        return self.get_random_seat(row_start=self.premium_rows, row_end=self.rows)

    def assign_seat(self, row, column, family):
        """
        Sets the matrix cell representing the seat to the family number.
        This seat will be regarded to as occupied.
        """
        assert self.plane[row][column] == 0
        self.plane[row][column] = family
