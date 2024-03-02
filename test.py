import calendar


one_list = [1,2,3]
two_list = [4,5,6]

print(one_list + two_list)
print(tuple([1,2,3]))

comps = [("Lenovo", 2499), ("HP", 2099)]
print(sorted(comps, key=lambda comp:comp[1]))
print(comps)

def scope_test():
    def do_local():
        spam = "local spam"
    def do_nonlocal():
        nonlocal spam
        spam = "nonlocal spam"
    def do_global():
        global spam
        spam = "global spam"


    spam = "test spam"
    do_local()
    print("After local assignment:", spam)
    do_nonlocal()
    print("After nonlocal assignment:", spam)
    do_global()
    print("After global assignment:", spam)


scope_test()
print("In global scope:", spam) 

print(tuple("123"))
for i in range(-5,-1,1):
    print(i)

print(type({1,}))