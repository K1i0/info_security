# 
def bin_pow(a, x, p):
    result = 1
    while(x):
        if (x & 1):
            result = (result * a)
            --x;
        else:
            a = (a * a)
            x >>= 1
    return result

a = int(input('Enter a: '))
x = int(input('Enter x: '))
p = int(input("Enter p: "))
print(bin_pow(a, x, p))