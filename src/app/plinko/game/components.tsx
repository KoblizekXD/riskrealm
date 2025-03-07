




type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16




//Plinko game body
export function PlinkoGameBody() {
  return <div id="plinko" />
}



//Multiplier history
interface MultiplierHistoryProps {
  multiplierHistory: number[]
}
export function MultiplierHistory({
  multiplierHistory
}: MultiplierHistoryProps) {
  return (
    <div className="mt-8 md:mt-0 md:absolute right-4 flex md:w-16 md:flex-col gap-1 overflow-hidden">
      {multiplierHistory.map((multiplier, index) => {
        if (index > 3 || !multiplier) return null
        return (
          <span
            key={`${multiplier}${index}${Math.random()}`}
            className="flex items-center justify-center bg-purpleDark p-1 rounded-md font-bold text-[#D4AF37] border border-[#D4AF37]"
          >
            {multiplier}x
          </span>
        )
      })}
    </div>
  )
}

