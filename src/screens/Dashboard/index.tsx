import React, { useState, useEffect } from 'react';

import AsyncStorage from "@react-native-async-storage/async-storage";

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

export function Dashboard() {
    const [data, setData] = useState<DataListProps[]>([]);

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];

        const transactionsFormatted: DataListProps[] =transactions
        .map(( item: DataListProps ) => {
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

        setData(transactionsFormatted);
    }
       
    useEffect(() => {
        loadTransactions()
    }, [])

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
                 amount ="R$ 17.400,00"
                 lastTransaction ="Última entrada dia 01 de semtembro"
                />
                <HighlightCard       
                 type="down"           
                 title ="Saidas" 
                 amount ="R$ 1.259,00"
                 lastTransaction ="Última saida dia 6 de semtembro"
                />
                <HighlightCard     
                 type="total"             
                 title ="Total" 
                 amount ="R$ 16.141,00"
                 lastTransaction =" 01 à 10 de semtembro"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data ={data}
                    keyExtractor ={ item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </Transactions>
        </Container>
    );
};