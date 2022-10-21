from pyteal import *


@Subroutine(TealType.uint64)
def get_price(meal: Expr):
    get_meal_price = App.globalGetEx(meal, Bytes("PRICE"))

    meal_price = ScratchVar(TealType.uint64)
    return Seq(
        get_meal_price,
        If(get_meal_price.hasValue(), meal_price.store(
            get_meal_price.value()), meal_price.store(Int(0))
           ),

        Return(meal_price.load())
    )


@ Subroutine(TealType.bytes)
def get_name(meal: Expr):
    get_meal_name = App.globalGetEx(meal, Bytes("NAME"))
    meal_name = ScratchVar(TealType.bytes)
    return Seq(
        get_meal_name,
        If(get_meal_name.hasValue(), meal_name.store(
            get_meal_name.value()), meal_name.store(Bytes(""))
           ),

        Return(meal_name.load())
    )


class Order:
    payment_address = Addr(
        "GROKXQMELYOO5WDE6U5OP2TRKF3ZCSIBCV47KBEJWMMNPUDXLQGS7SXQSM")

    class Variables:
        total = Bytes("TOTAL")
        time = Bytes("TIME")

    def application_creation(self):
        i = ScratchVar(TealType.uint64)
        meal_id = ScratchVar(TealType.uint64)
        price = ScratchVar(TealType.uint64)
        count = ScratchVar(TealType.uint64)
        total_amount = ScratchVar(TealType.uint64)
        meal_name = ScratchVar(TealType.bytes)

        return Seq([
            Assert(
                And(
                    # check that group contains two transactions
                    Global.group_size() == Int(2),
                    # check that this transaction is the first
                    Txn.group_index() == Int(0),
                    Txn.note() == Bytes("foodiz-order:uv1"),
                    Txn.application_args.length() <= Int(10),
                    Txn.applications.length() <= Int(10),
                    Txn.applications.length() ==
                    Txn.application_args.length(),
                )
            ),

            total_amount.store(Int(0)),

            # loop through the applications array
            For(i.store(Int(0)), i.load() < Txn.applications.length(),
                i.store(i.load() + Int(1))).Do(

                # store the meal's application id in the meal_id scratchVar
                meal_id.store(Txn.applications[i.load() + Int(1)]),

                # store the meal's count in the count scratchVar
                count.store(Btoi(Txn.application_args[i.load()])),

                # get the meal price and store in the price variable
                price.store(get_price(meal_id.load())),

                # update the total amount with the meal's price
                total_amount.store(total_amount.load() +
                                   (price.load() * count.load())),

                # store meal name
                meal_name.store(get_name(meal_id.load())),

                # store in global storage
                App.globalPut(meal_name.load(), App.globalGet(meal_name.load()) + count.load())
            ),

            # Check for payment transaction params, if it fails, group txn fails
            Assert(
                Gtxn[1].type_enum() == TxnType.Payment,
                Gtxn[1].receiver() == self.payment_address,
                Gtxn[1].amount() == total_amount.load(),
                Gtxn[1].sender() == Gtxn[0].sender(),
            ),

            # set total and amount
            App.globalPut(self.Variables.total, total_amount.load()),

            App.globalPut(self.Variables.time, Global.latest_timestamp()),

            Approve()
        ])

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
