import { Box, Input, Flex, Text, VStack, useBoolean, Skeleton, HStack, SkeletonText, Show, Image, Tag, Heading } from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import React, { useState, useEffect } from "react";

interface Show {
  score: number;
  show: {
    id: number;
    name: string;
    type: string;
    genres: string[];
    image?: {
      medium: string;
    };
    summary: string;
  };
}

const Placeholder = ({ count = 2 }: { count?: number }) => {
  return new Array(count).fill(null).map((_, idx) => (
    <Box key={idx} boxShadow='lg' w="100%">
      <HStack bg='white'>
        <Skeleton flex={1} height="157px" bg="darkblue" />
        <SkeletonText p={4} flex={1} noOfLines={4} spacing='4' skeletonHeight='2' />
      </HStack>
    </Box>
  ))
}

function ShowCard({ show: { image, genres, name, summary } }: Show) {
  return (
    <Flex
      w="full"
      shadow="sm"
      rounded="lg"
      overflow="hidden"
      borderWidth="1px"
      _hover={{
        cursor: "pointer",
        shadow: "lg"
      }}
    >
      <Image fallbackSrc="https://via.placeholder.com/112x157.png?text=No+image" width={112} height={157} src={image?.medium} />
      <VStack w="100%" p={4} spacing={2} alignItems="flex-start">
        <HStack w="inherit" spacing={2}>
          {genres.map((genre) => (
            <Tag
              size="sm"
              key={genre}
              color="black"
              bg="gray.100"
              variant='solid'
            >
              {genre}
            </Tag>
          ))}
        </HStack>
        <Heading as="h2" color="gray.600" fontSize={16}>{name}</Heading>
        <Text fontSize="13px" color="gray.500" noOfLines={2} dangerouslySetInnerHTML={{ __html: summary }} />
      </VStack>
    </Flex>
  );
}


export default function Two() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Show[]>([]);
  const [loading, { toggle: toggleLoading }] = useBoolean(false)
  const [searchValue] = useDebounce(search, 500);
  const hasPositiveSearchValue = searchValue.trim().length > 0

  const onMovieSearch = async (search: string) => {
    if (search.length < 1) return;
    toggleLoading()
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const request = await fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
      if (!request.ok) throw new Error('Unable to fetch data')
      const movies = await request.json() as Show[]
      setMovies(movies)
    } catch (error) {
      console.log(error)
    } finally {
      toggleLoading()
    }
  }

  useEffect(() => {
    onMovieSearch(searchValue)
  }, [searchValue])


  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <VStack spacing={4}>
      <Input
        mb={2}
        type="text"
        disabled={loading}
        placeholder="Search for a TV show"
        onChange={handleSearch}
      />
      {loading ? <Placeholder /> : <>
        {!hasPositiveSearchValue ? (
          <Text textAlign="center" fontSize="sm" color="gray.500">
            Nothing here. Try searching for a TV show above!
          </Text>
        ) : <>
          {movies.length > 0 ? <>
            {movies.map(({ score, show }) => (
              <ShowCard key={show.id} show={show} score={score} />
            ))}
          </> : <Text textAlign="center" fontSize="sm" color="gray.500">
            No results for "{searchValue}"
          </Text>}
        </>}
      </>}
    </VStack>
  );
}