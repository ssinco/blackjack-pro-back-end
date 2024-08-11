import { useState, useEffect } from 'react';

// setting is pairs, hard totals, soft totals
const useScenarios = (setting) => {
    // cases will be an array of objects. Each object as a scenario
        // dealerUpCard: String
        // playerCards: [String, String]
        // optimalChoice: String
    
    const [scenarios, setScenarios] = useState ([])

    const nextScenario = () => {
        const newScenarios = scenarios.slice(1)
        setScenarios(newScenarios)
    }

    const buildScenarios = (setting) => {
        let selectedScenarios = []
        if (setting === 'test') {
            selectedScenarios = [
                { dealerUpCard: '2', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['3', '3'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
            ]
        }
        if (setting === 'pairs') {
            selectedScenarios = [
                { dealerUpCard: '2', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '3', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '4', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['2', '2'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['2', '2'], optimalChoice: 'hit' },
                { dealerUpCard: '9', playerCards: ['2', '2'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['2', '2'], optimalChoice: 'hit' },
                // { dealerUpCard: 'jack', playerCards: ['2', '2'], optimalChoice: 'hit' },
                // { dealerUpCard: 'queen', playerCards: ['2', '2'], optimalChoice: 'hit' },
                // { dealerUpCard: 'king', playerCards: ['2', '2'], optimalChoice: 'hit' },
                { dealerUpCard: 'ace', playerCards: ['2', '2'], optimalChoice: 'hit' },
            
                { dealerUpCard: '2', playerCards: ['3', '3'], optimalChoice: 'split' },
                { dealerUpCard: '3', playerCards: ['3', '3'], optimalChoice: 'split' },
                { dealerUpCard: '4', playerCards: ['3', '3'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['3', '3'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['3', '3'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['3', '3'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['3', '3'], optimalChoice: 'hit' },
                { dealerUpCard: '9', playerCards: ['3', '3'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['3', '3'], optimalChoice: 'hit' },
                // { dealerUpCard: 'jack', playerCards: ['3', '3'], optimalChoice: 'hit' },
                // { dealerUpCard: 'queen', playerCards: ['3', '3'], optimalChoice: 'hit' },
                // { dealerUpCard: 'king', playerCards: ['3', '3'], optimalChoice: 'hit' },
                { dealerUpCard: 'ace', playerCards: ['3', '3'], optimalChoice: 'hit' },
            
                { dealerUpCard: '2', playerCards: ['4', '4'], optimalChoice: 'hit' },
                { dealerUpCard: '3', playerCards: ['4', '4'], optimalChoice: 'hit' },
                { dealerUpCard: '4', playerCards: ['4', '4'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['4', '4'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['4', '4'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['4', '4'], optimalChoice: 'hit' },
                { dealerUpCard: '8', playerCards: ['4', '4'], optimalChoice: 'hit' },
                { dealerUpCard: '9', playerCards: ['4', '4'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['4', '4'], optimalChoice: 'hit' },
                // { dealerUpCard: 'jack', playerCards: ['4', '4'], optimalChoice: 'hit' },
                // { dealerUpCard: 'queen', playerCards: ['4', '4'], optimalChoice: 'hit' },
                // { dealerUpCard: 'king', playerCards: ['4', '4'], optimalChoice: 'hit' },
                { dealerUpCard: 'ace', playerCards: ['4', '4'], optimalChoice: 'hit' },
            
                { dealerUpCard: '2', playerCards: ['5', '5'], optimalChoice: 'double' },
                { dealerUpCard: '3', playerCards: ['5', '5'], optimalChoice: 'double' },
                { dealerUpCard: '4', playerCards: ['5', '5'], optimalChoice: 'double' },
                { dealerUpCard: '5', playerCards: ['5', '5'], optimalChoice: 'double' },
                { dealerUpCard: '6', playerCards: ['5', '5'], optimalChoice: 'double' },
                { dealerUpCard: '7', playerCards: ['5', '5'], optimalChoice: 'double' },
                { dealerUpCard: '8', playerCards: ['5', '5'], optimalChoice: 'hit' },
                { dealerUpCard: '9', playerCards: ['5', '5'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['5', '5'], optimalChoice: 'hit' },
                // { dealerUpCard: 'jack', playerCards: ['5', '5'], optimalChoice: 'hit' },
                // { dealerUpCard: 'queen', playerCards: ['5', '5'], optimalChoice: 'hit' },
                // { dealerUpCard: 'king', playerCards: ['5', '5'], optimalChoice: 'hit' },
                { dealerUpCard: 'ace', playerCards: ['5', '5'], optimalChoice: 'hit' },
            
                { dealerUpCard: '2', playerCards: ['6', '6'], optimalChoice: 'split' },
                { dealerUpCard: '3', playerCards: ['6', '6'], optimalChoice: 'split' },
                { dealerUpCard: '4', playerCards: ['6', '6'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['6', '6'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['6', '6'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['6', '6'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['6', '6'], optimalChoice: 'hit' },
                { dealerUpCard: '9', playerCards: ['6', '6'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['6', '6'], optimalChoice: 'hit' },
                // { dealerUpCard: 'jack', playerCards: ['6', '6'], optimalChoice: 'hit' },
                // { dealerUpCard: 'queen', playerCards: ['6', '6'], optimalChoice: 'hit' },
                // { dealerUpCard: 'king', playerCards: ['6', '6'], optimalChoice: 'hit' },
                { dealerUpCard: 'ace', playerCards: ['6', '6'], optimalChoice: 'hit' },
            
                { dealerUpCard: '2', playerCards: ['7', '7'], optimalChoice: 'split' },
                { dealerUpCard: '3', playerCards: ['7', '7'], optimalChoice: 'split' },
                { dealerUpCard: '4', playerCards: ['7', '7'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['7', '7'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['7', '7'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['7', '7'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['7', '7'], optimalChoice: 'hit' },
                { dealerUpCard: '9', playerCards: ['7', '7'], optimalChoice: 'hit' },
                { dealerUpCard: '10', playerCards: ['7', '7'], optimalChoice: 'hit' },
                // { dealerUpCard: 'jack', playerCards: ['7', '7'], optimalChoice: 'hit' },
                // { dealerUpCard: 'queen', playerCards: ['7', '7'], optimalChoice: 'hit' },
                // { dealerUpCard: 'king', playerCards: ['7', '7'], optimalChoice: 'hit' },
                { dealerUpCard: 'ace', playerCards: ['7', '7'], optimalChoice: 'hit' },
            
                { dealerUpCard: '2', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '3', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '4', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '9', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: '10', playerCards: ['8', '8'], optimalChoice: 'split' },
                // { dealerUpCard: 'jack', playerCards: ['8', '8'], optimalChoice: 'split' },
                // { dealerUpCard: 'queen', playerCards: ['8', '8'], optimalChoice: 'split' },
                // { dealerUpCard: 'king', playerCards: ['8', '8'], optimalChoice: 'split' },
                { dealerUpCard: 'ace', playerCards: ['8', '8'], optimalChoice: 'split' },
            
                { dealerUpCard: '2', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '3', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '4', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '5', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '6', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '7', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '8', playerCards: ['9', '9'], optimalChoice: 'stand' },
                { dealerUpCard: '9', playerCards: ['9', '9'], optimalChoice: 'split' },
                { dealerUpCard: '10', playerCards: ['9', '9'], optimalChoice: 'stand' },
                // { dealerUpCard: 'jack', playerCards: ['9', '9'], optimalChoice: 'stand' },
                // { dealerUpCard: 'queen', playerCards: ['9', '9'], optimalChoice: 'stand' },
                // { dealerUpCard: 'king', playerCards: ['9', '9'], optimalChoice: 'stand' },
                { dealerUpCard: 'ace', playerCards: ['9', '9'], optimalChoice: 'stand' },
            
                { dealerUpCard: '2', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '3', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '4', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '5', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '6', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '7', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '8', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: '9', playerCards: ['10', '10'], optimalChoice: 'stand' },
                { dealerUpCard: '10', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: 'jack', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: 'queen', playerCards: ['10', '10'], optimalChoice: 'stand' },
                // { dealerUpCard: 'king', playerCards: ['10', '10'], optimalChoice: 'stand' },
                { dealerUpCard: 'ace', playerCards: ['10', '10'], optimalChoice: 'stand' },
            
                { dealerUpCard: '2', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '3', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '4', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '5', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '6', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '7', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '8', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: '9', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                { dealerUpCard: '10', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: 'jack', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: 'queen', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                // { dealerUpCard: 'king', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
                { dealerUpCard: 'ace', playerCards: ['jack', 'jack'], optimalChoice: 'stand' },
            
                { dealerUpCard: '2', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '3', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '4', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '5', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '6', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '7', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '8', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: '9', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                { dealerUpCard: '10', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: 'jack', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: 'queen', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                // { dealerUpCard: 'king', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
                { dealerUpCard: 'ace', playerCards: ['queen', 'queen'], optimalChoice: 'stand' },
            
                { dealerUpCard: '2', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '3', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '4', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '5', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '6', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '7', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '8', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: '9', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                { dealerUpCard: '10', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: 'jack', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: 'queen', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                // { dealerUpCard: 'king', playerCards: ['king', 'king'], optimalChoice: 'stand' },
                { dealerUpCard: 'ace', playerCards: ['king', 'king'], optimalChoice: 'stand' },
            
                { dealerUpCard: '2', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '3', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '4', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '5', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '6', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '7', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '8', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: '9', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                { dealerUpCard: '10', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: 'jack', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: 'queen', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                // { dealerUpCard: 'king', playerCards: ['ace', 'ace'], optimalChoice: 'split' },
                { dealerUpCard: 'ace', playerCards: ['ace', 'ace'], optimalChoice: 'split' }
            ];
        }

        return selectedScenarios 
    }

    useEffect(() => {
        setScenarios(buildScenarios(setting))},[setting]
    )
    

    
    return {
        scenarios,
        nextScenario,
        setScenarios,
        buildScenarios,
    }


    // const values = [
    //     '2', '3', '4', '5', '6', '7', '8', '9', '10',
    //     'jack', 'queen', 'king', 'ace'
    // ]

};

export default useScenarios