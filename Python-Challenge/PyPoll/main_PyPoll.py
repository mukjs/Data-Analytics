import os
import csv

#initializing variables to 0
voter=[]
candidate=[]
khan=0
correy=0
li=0
otooley=0

# opening and reading csv, calculating metrics
csvpath=os.path.join("election_data.csv")

with open (csvpath,newline="") as csvfile:
    csvreader=csv.reader(csvfile,delimiter=",")

    next(csvfile)
    
    for row in csvreader:
        voter.append(row[0])
        candidate.append(row[2])

total_votes=len(voter)

for i in range(0,int(len(voter))):
        if candidate[i] == "Khan":
            khan=khan+1
        elif candidate[i] == "Correy":
            correy=correy+1
        elif candidate[i] == "Li":
            li=li+1
        elif candidate[i] == "O'Tooley":
            otooley=otooley+1

perc_khan=khan/len(voter)*100
perc_correy=correy/len(voter)*100
perc_li=li/len(voter)*100
perc_otooley=otooley/len(voter)*100

if max(khan,correy,li,otooley)==khan:
    winner="Khan"
elif max(khan,correy,li,otooley)==correy:
    winner="Correy"
elif max(khan,correy,li,otooley)==li:
    winner="Li"
else:
    winner="O'Tooley"    

# Printing to terminal
print("Election Results")
print("-------------------------")
print(f'Total Votes: {len(voter)}')
print("-------------------------")
print(f'Khan: {round(perc_khan,4)}% ({khan})')
print(f'Correy: {round(perc_correy,4)}% ({correy})')
print(f'Li: {round(perc_li,4)}% {li}')
print(f'O\'Tooley: {round(perc_otooley,4)}% ({otooley})')
print("-------------------------")
print(f'Winner: {winner}')
print("-------------------------")

#Exporting to txt file
txt_file=open("PyPoll output.txt","w")
txt_file.write("Election Results\n")
txt_file.write("-------------------------\n")
txt_file.write(f'Total Votes: {len(voter)}\n')
txt_file.write("-------------------------\n")
txt_file.write(f'Khan: {round(perc_khan,4)}% ({khan})\n')
txt_file.write(f'Correy: {round(perc_correy,4)}% ({correy})\n')
txt_file.write(f'Li: {round(perc_li,4)}% {li}\n')
txt_file.write(f'O\'Tooley: {round(perc_otooley,4)}% ({otooley})\n')
txt_file.write("-------------------------\n")
txt_file.write(f'Winner: {winner}\n')
txt_file.write("-------------------------\n")