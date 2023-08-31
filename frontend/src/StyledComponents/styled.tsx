import styled from '@emotion/styled'

export const BgColor = styled.div<{ color: string }>`
    background-color: ${(props) => props.color};
`
export const Text = styled.div<{color: string}>`
    font-family: 'Nunito';
    color: ${({color}) => color ?? 'white'};
    font-size: 16px;
`
export const HeaderText = styled.div<{
    md: boolean
    lg: boolean
    sm: boolean
    xs: boolean
    xl: boolean
    color: string
    font: string
}>`
    font-family: 'Nunito';
    color: ${(props) => props.color ?? 'black;'};
    font-size: 12px;
    font-weight: 400;

        ${({md}) =>
            md==true  ? 'font-size: 32px; font-weight: 600;' : ''}
        ${({lg}) =>
            lg==true ? 'font-size: 36px; font-weight: 700;' : ''}
        ${({xl}) =>
            xl==true ? 'font-size: 36px; font-weight: 800;' : ''}
        ${({sm}) =>
            sm==true ? 'font-size: 28px; font-weight: 300;' : ''}
        ${({xs}) => 
            xs==true? 'font-size: 24px; font-weight: 300;' : ''}
        ${({font}) => 
            font ? `font-family: ${font}`:''}
        
`
