import React, { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import './Main.scss'

type Difficulty = {
    id: string;
    name: string;
    field: number;
};

type ModeData = {
    name: string;
    field: number;
    id: string;
};

type Props = {}

const Main = (props: Props) => {
    const [hoveredSquares, setHoveredSquares] = useState<number[]>([]);
    const [modes, setModes] = useState<ModeData[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

    const handleSquareHover = (squareIndex: number) => {
        if (!hoveredSquares.includes(squareIndex)) {
            setHoveredSquares([...hoveredSquares, squareIndex])
        }
    }

    const handleSquareLeave = (squareIndex: number) => {
        if (hoveredSquares.includes(squareIndex)) {
            setHoveredSquares(hoveredSquares.filter((index) => index !== squareIndex))
        }
    }

    const handleFieldLeave = () => {
        setHoveredSquares([])
    }

    const handleDifficultyChange = (difficulty: Difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://60816d9073292b0017cdd833.mockapi.io/modes');
                const data = await response.json();
                setModes(data);
                setSelectedDifficulty(data[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedDifficulty) {
            setHoveredSquares([]);
        }
    }, [selectedDifficulty]);

    return (
        <>
            <Container className="container">
                <div className='difficulties-box'>
                    <h2>Выберите сложность:</h2>
                    <div className="difficulties-buttons">
                        {modes.map((mode) => (
                            <button key={mode.id} onClick={() => handleDifficultyChange(mode)}>
                                {mode.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="game-field">
                    <div className="field" onMouseLeave={handleFieldLeave}>
                        {selectedDifficulty && Array(selectedDifficulty.field)
                            .fill(null)
                            .map((_, row) => (
                                <div key={row} className="row">
                                    {Array(selectedDifficulty.field)
                                        .fill(null)
                                        .map((_, col) => {
                                            const squareIndex = row * selectedDifficulty.field + col
                                            const isHovered = hoveredSquares.includes(squareIndex)
                                            const squareClass = `square ${isHovered ? 'blue' : ''}`
                                            return (
                                                <div
                                                    key={col}
                                                    className={squareClass}
                                                    onMouseEnter={() => handleSquareHover(squareIndex)}
                                                    onMouseLeave={() => handleSquareLeave(squareIndex)}
                                                ></div>
                                            )
                                        })}
                                </div>
                            ))}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Main