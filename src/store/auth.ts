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

function random(min: number, max: number) {
  const random = Math.random()
  min = Math.round(min)
  max = Math.floor(max)

  return random * (max - min) + min
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