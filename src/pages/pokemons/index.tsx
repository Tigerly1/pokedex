import React, { useState, useEffect } from "react";
import { Input, Card, Space, Typography, Image } from 'antd';
import { fetchPokemons } from 'src/pages/api/pokeApi'
import { PokemonData } from "@/types/pokemon";
import { colors } from "@/styles/colors"

const { Text, Title } = Typography;
const { Search } = Input;

const textCenter = { textAlign: "center" }

const Pokemons = () => {
    const [data, setData] = useState<PokemonData[]>([])
    const [filteredData, setFilteredData] = useState<PokemonData[]>([])

    const onSearch = (value: string) => {
        if (value === '') {
            setFilteredData((prev: PokemonData[]) => [...data]);
            return;
        }
        const filterData = [...data].filter((el) => {
            return el.name.toLowerCase().includes(value.toLowerCase())
        })
        console.log(filterData)
        setFilteredData(filterData)
    };

    const loadData = async () => {
        const newData = await fetchPokemons(300, 0);
        //await prefetchImages(newData);

        setData((prev: PokemonData[]) => [...newData]);
        setFilteredData((prev: PokemonData[]) => [...newData]);
        console.log(newData)
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <>
            <Space direction="vertical" style={{ display: 'flex', alignItems: "center", marginLeft: "auto", marginRight: "auto" }}>
                <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
                <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent: "center", margin: "auto" }} wrap>
                    {filteredData.map((item: PokemonData) => ((
                        <Card title={item.id + ".  " + item.name} size="small" key={item.id.toString()}>
                            <Image alt='pokemon' src={item.imageUrl} width={200} height={200} />
                            <Title level={5}>Hp: {item.stats.hp}, Attack: {item.stats.attack} </Title>
                            <Title level={5}>Defense: {item.stats.defense}, Speeed: {item.stats.speed} </Title>
                            <Space direction="horizontal">
                                {item.types.map((type) => {
                                    return (<Text style={colors[type as keyof typeof colors]} key={type}>{type + " "}</Text>)
                                }
                                )}
                            </Space>
                        </Card>
                    )))}
                </Space>
            </Space>
        </>

    );
};
export default Pokemons;