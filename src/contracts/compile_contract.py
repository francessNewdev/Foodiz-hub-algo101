from pyteal import *

from meal_contract import Meal

from order_contract import Order

import os

if __name__ == "__main__":

    cwd = os.path.dirname(__file__)

    approval_program_meal = Meal().approval_program()
    clear_program_meal = Meal().clear_program()

    approval_program_order = Order().approval_program()
    clear_program_order = Order().clear_program()

    # Compile approval program for meal
    compiled_approval_meal = compileTeal(
        approval_program_meal, Mode.Application, version=6)
    print(compiled_approval_meal)

    file_name = os.path.join(cwd, "meal_approval.teal")
    with open(file_name, "w") as teal:
        teal.write(compiled_approval_meal)
        teal.close()

    # Compile clear program for meal
    compiled_clear_meal = compileTeal(
        clear_program_meal, Mode.Application, version=6)
    print(compiled_clear_meal)
    file_name = os.path.join(cwd, "meal_clear.teal")
    with open(file_name, "w") as teal:
        teal.write(compiled_clear_meal)
        teal.close()

    # Compile approval program for order
    compiled_approval_order = compileTeal(
        approval_program_order, Mode.Application, version=6)
    print(compiled_approval_order)

    file_name = os.path.join(cwd, "order_approval.teal")
    with open(file_name, "w") as teal:
        teal.write(compiled_approval_order)
        teal.close()

  # Compile clear program for order
    compiled_clear_order = compileTeal(
        clear_program_order, Mode.Application, version=6)
    print(compiled_clear_order)
    file_name = os.path.join(cwd, "order_clear.teal")
    with open(file_name, "w") as teal:
        teal.write(compiled_clear_order)
        teal.close()
