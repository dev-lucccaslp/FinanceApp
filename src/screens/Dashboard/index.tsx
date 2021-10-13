import React from 'react';

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserName,
    UserGreeting,

} 
from './styles';

export function Dashboard() {
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
                </UserWrapper>
            </Header>
        </Container>
    );
};