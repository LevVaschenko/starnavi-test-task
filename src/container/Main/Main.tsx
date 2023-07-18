import React, { useEffect, useState } from 'react'
import { Container } from '@mui/material'

type Difficulty = {
    id: string
    name: string
    field: number
}

type ModeData = {
    name: string
    field: number
    id: string
}

type Props = {}

const Main = (props: Props) => {
    const [hoveredSquares, setHoveredSquares] = useState<number[]>([])
    const [modes, setModes] = useState<ModeData[]>([])
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
    const [blueSquares, setBlueSquares] = useState<number[]>([])
    const [startClicked, setStartClicked] = useState(false)

    const handleSquareHover = (squareIndex: number) => {
        if (startClicked && !hoveredSquares.includes(squareIndex)) {
            setHoveredSquares([...hoveredSquares, squareIndex])
            setBlueSquares([...blueSquares, squareIndex])
        }
    }

    const handleSquareLeave = (squareIndex: number) => {
        if (startClicked && hoveredSquares.includes(squareIndex)) {
            setHoveredSquares(hoveredSquares.filter((index) => index !== squareIndex))
            setBlueSquares(blueSquares.filter((index) => index !== squareIndex))
        }
    }

    const handleFieldLeave = () => {
        if (startClicked) {
            const filledSquares = blueSquares.filter(squareIndex => hoveredSquares.includes(squareIndex))
            setHoveredSquares([...hoveredSquares, ...filledSquares])
        }
    }

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMode = modes.find((mode) => mode.id === event.target.value)
        if (selectedMode) {
            setSelectedDifficulty(selectedMode)
            setHoveredSquares([])
            setBlueSquares([])
            setStartClicked(false)
        }
    }

    const handleStartClick = () => {
        setStartClicked(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://60816d9073292b0017cdd833.mockapi.io/modes')
                const data = await response.json()
                setModes(data)
                setSelectedDifficulty(data[0])
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <Container className="container" style={{ display: 'flex', alignItems: 'flex-start', height: '90vh' }}>
                <div className="game-field">
                    <div
                        className="settings-box"
                        style={{ display: 'flex', alignItems: 'flex-start' }}
                    >
                        <select
                            className="select"
                            value={selectedDifficulty?.id || ''}
                            onChange={handleDifficultyChange}
                            style={{ marginTop: '50px', marginBottom: '50px', width: '140px', height: '30px' }}
                        >
                            {modes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.name}
                                </option>
                            ))}
                        </select>
                        {!startClicked && (
                            <div className="start-container" style={{ marginTop: '50px', marginBottom: '50px', marginLeft: '15px'}}>
                                <button className='start-button' style={{ width: '80px', height: '30px', color: 'white', backgroundColor: 'rgb(12, 93, 207)', border: 'none', borderRadius: '3px', cursor: 'pointer' }} onClick={handleStartClick}>
                                    START
                                </button>
                            </div>
                        )}
                    </div>
                    {startClicked && selectedDifficulty && (
                        <div className="field" onMouseLeave={handleFieldLeave} style={{ marginTop: '30px', display: 'flex' }}>
                            {Array(selectedDifficulty.field)
                                .fill(null)
                                .map((_, row) => (
                                    <div key={row} className="row">
                                        {Array(selectedDifficulty.field)
                                            .fill(null)
                                            .map((_, col) => {
                                                const squareIndex = row * selectedDifficulty.field + col
                                                const isHovered = hoveredSquares.includes(squareIndex)
                                                const squareClass = `square ${isHovered ? 'blue' : ''}`
                                                const uniqueSquareKey = `square-${row}-${col}`
                                                return (
                                                    <div
                                                        key={uniqueSquareKey}
                                                        className={squareClass}
                                                        onMouseEnter={() => handleSquareHover(squareIndex)}
                                                        onMouseLeave={() => handleSquareLeave(squareIndex)}
                                                        style={{ width: '50px', height: '50px', border: '1.5px solid black', cursor: 'pointer', order: isHovered ? 1 : 0, backgroundColor: isHovered ? 'rgb(12, 93, 207)' : 'transparent' }}
                                                    ></div>
                                                )
                                            })}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                {startClicked && selectedDifficulty && (
                    <div className="hover-squares" style={{ marginLeft: '65px' }}>
                        <div>
                            <h2 className="hover-squares-text" style={{ marginTop: '50px', marginBottom: '20px'}}>Hover squares</h2>
                        </div>
                        <div className="hover-squares-details" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            {blueSquares.map((squareIndex, index) => {
                                const row = Math.floor(squareIndex / selectedDifficulty.field) + 1
                                const col = (squareIndex % selectedDifficulty.field) + 1
                                const uniqueHoverSquareKey = `hover-square-${row}-${col}-${index}`
                                return (
                                    <div
                                        key={uniqueHoverSquareKey}
                                        className="hover-square"
                                        style={{ width: '175px', display: 'flex', color: 'rgba(123, 96, 52)', backgroundColor: 'rgba(251, 247, 220)', padding: '8px', fontWeight: 'bold', marginBottom: '2.5px' }}
                                    >
                                        row {row} col {col}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </Container>
        </>
    )
}

export default Main