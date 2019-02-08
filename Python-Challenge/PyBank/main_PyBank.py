import os
import csv

month=[]
profit=[]
change=[]

csvpath = os.path.join("budget_data.csv")

with open(csvpath, newline="") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")

#skipping headers
    next(csvfile)

#create lists to store month and profits
    for row in csvreader:
        month.append(row[0])
        profit.append(row[1])

#calculate total profits
    total_profit=0

    for num in profit:
        total_profit=total_profit+int(num)
   
#create list to store change across months   
    for i in range(0,len(month)-1):
        change.append(int(profit[i+1])-int(profit[i]))

#calculate total change & avg change
    total_change=0

    for num in change:
        total_change=total_change+int(num)

    average_change=total_change/len(change) 

#calculate max increase and decrease in change
    max_increase=max(change)
    max_decrease=min(change)

    index_max_increase=change.index(max_increase)
    index_max_decrease=change.index(max_decrease)

#print analysis to terminal
print("Financial Analysis")
print("--------------------------------------------------------------")
print(f'Total Months: {len(month)}')
print(f'Total: ${total_profit}')
print(f'Average Change: ${round(average_change,2)}')
print(f'Greatest Increase in Profits: {month[index_max_increase+1]} (${max_increase})')
print(f'Greatest Decrease in Profits: {month[index_max_decrease+1]} (${max_decrease})')

#exporting to a text file
txt_file=open("Pybank output.txt","w")
txt_file.write("Financial Analysis\n")
txt_file.write("--------------------------------------------------------------\n")
txt_file.write(f'Total Months: {len(month)}\n')
txt_file.write(f'Total: ${total_profit}\n')
txt_file.write(f'Average Change: ${round(average_change,2)}\n')
txt_file.write(f'Greatest Increase in Profits: {month[index_max_increase+1]} (${max_increase})\n')
txt_file.write(f'Greatest Decrease in Profits: {month[index_max_decrease+1]} (${max_decrease})')
txt_file.close()