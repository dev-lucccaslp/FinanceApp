import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from '@react-navigation/core';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserName,
    UserGreeting,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton
} 
from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps{
    amount: string;
}
interface HighLightData {
    entries: HighLightProps;
    expensives:HighLightProps;
    total: HighLightProps;
}

export function Dashboard() {
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData)

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map(( item: DataListProps ) => {
            
            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else{
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style:'currency',
                currency: 'BRL'
            });
            
            const date= Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }   
        });

        setTransactions(transactionsFormatted);

        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency:'BRL'
                })
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency:'BRL'
                })
            },
            total :{
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency:'BRL'
                })
            }    
        });

        console.log(transactionsFormatted)
    }
       
    useEffect(() => {
        loadTransactions()

        // const dataKey = '@gofinances:transactions';
        // AsyncStorage.removeItem(dataKey);
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions();
    },[] ));

    return(
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source ={{uri: 'https://avatars.githubusercontent.com/u/73972488?v=4'}}/>
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Lucas</UserName>
                        </User>
                    </UserInfo>
                        <LogoutButton onPress={() => {}}>
                            <Icon name="power"/>
                        </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                 type="up"
                 title ="Entradas" 
                 amount ={highLightData.entries.amount}
                 lastTransaction ="Última entrada dia 01 de semtembro"
                />
                <HighlightCard       
                 type="down"           
                 title ="Saidas" 
                 amount ={highLightData.expensives.amount}
                 lastTransaction ="Última saida dia 6 de semtembro"
                />
                <HighlightCard     
                 type="total"             
                 title ="Total" 
                 amount ='0000'
                 lastTransaction =" 01 à 10 de semtembro"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data ={transactions}
                    keyExtractor ={ item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </Transactions>
        </Container>
    );
};