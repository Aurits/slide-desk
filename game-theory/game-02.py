def main():
    print("welcome to game theory")
    player1 = input("Player 1, enter your name: ")
    player2 = input("Player 2, enter your name: ")
    print(f"{player1} and {player2}, let's play!")
    dilemaA = "Cooperate"
    dilemaB = "Defect"

    payoff_matrix = {
        (dilemaA, dilemaA): (3, 3), #  Both cooperate
        (dilemaA, dilemaB): (0, 5), #  Player 1 cooperates, Player 2 defects
        (dilemaB, dilemaA): (5, 0), #  Player 1 defects, Player 2 cooperates
        (dilemaB, dilemaB): (1, 1)  #  Both defect
    }

    print(
        f"{player1} and {player2}, you have two choices: "
        f"{dilemaA} or {dilemaB}"
    )
    choice1 = input(f"{player1}, enter your choice: ").strip().capitalize()
    choice2 = input(f"{player2}, enter your choice: ").strip().capitalize()
    payoff1, payoff2 = payoff_matrix.get((choice1, choice2), (0, 0))
    print(f"{player1} chose {choice1} and {player2} chose {
choice2}.")
    print(f"{player1} receives a payoff of {payoff1}.")
    print(f"{player2} receives a payoff of {payoff2}.")

    
    
if __name__ == "__main__":
    main()


