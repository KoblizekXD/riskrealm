import { produce } from 'immer'


import { create } from 'zustand'



interface Wallet {
  balance: number
}

interface State {
  wallet: Wallet
  setBalance: (balance: number) => void
  incrementBalance: (amount: number) => void
  decrementBalance: (amount: number) => void
}


const walletInitialState: Wallet = {
  balance: 9999
}


export const useAuthStore = create<State>((setState, getState) => ({
  wallet: walletInitialState,

  setBalance: (balance: number) => {
    try {
      setState(
        produce<State>(state => {
          state.wallet.balance = balance
        })
      )
    } catch (error) {
      console.error('setBalanceError', error)
    }
  },
  incrementBalance: (amount: number) => {
    try {
      console.log('incrementBalance')
      const newBalance = getState().wallet.balance + amount
      getState().setBalance(newBalance)
      console.log(getState().wallet.balance)
    } catch (error) {
      console.error('incrementBalanceError', error)
    }
  },
  decrementBalance: (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      const newBalance = getState().wallet.balance - amount
      getState().setBalance(newBalance)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      console.error('decrementBalanceError', error)
    }
  },
}))



interface Game {
  gamesRunning: number
  setGamesRunning: (gamesRunning: number) => void
  incrementGamesRunning: () => void
  decrementGamesRunning: () => void
}

export const useGameStore = create<Game>((set, get) => ({
  
  gamesRunning: 0,
  setGamesRunning: (gamesRunning: number) => {
    set({ gamesRunning })
  },
  incrementGamesRunning: () => {
    const gamesRunning = get().gamesRunning
    const calc = gamesRunning + 1

    set({ gamesRunning: calc < 0 ? 1 : calc })
  },
  decrementGamesRunning: () => {
    const gamesRunning = get().gamesRunning
    const calc = gamesRunning - 1

    set({ gamesRunning: calc < 0 ? 0 : calc })
  }
}))
