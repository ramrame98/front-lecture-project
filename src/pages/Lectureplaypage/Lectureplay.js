import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Stack,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Input,
  Button,
} from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import LectureHeader from '../../components/LectureHeader/LectureHeader';
import { fetchVideoList } from '../../api';
import { BsListUl } from 'react-icons/bs';

const Video = () => {
  const navigate = useNavigate();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const playerRef = useRef(null);
  const location = useLocation();
  const handlePlayerReady = () => {
    if (playedSeconds > 0) {
      playerRef.current?.seekTo(parseFloat(playedSeconds), 'seconds');
    }
  };
  const handleDuration = duration => {
    console.log(duration); // logs the video duration in seconds
  };

  const handleProgress = state => {
    const now = new Date().getTime();
    const data = {
      playedSeconds: state.playedSeconds,
      lastPlayed: now,
    };
    localStorage.setItem('videoData', JSON.stringify(data));
    setPlayedSeconds(state.playedSeconds);
  };
  useEffect(() => {
    const savedData = localStorage.getItem('videoData');
    if (savedData) {
      const { playedSeconds, lastPlayed } = JSON.parse(savedData);
      const now = new Date().getTime();
      console.log('time', new Date().getTime());
      const timeDiff = now - lastPlayed;
      if (timeDiff < 86400000) {
        // 24 hours in milliseconds
        setPlayedSeconds(parseFloat(playedSeconds));
        playerRef.current?.seekTo(parseFloat(playedSeconds), 'seconds');
      }
    }
  }, []);
  const { id } = useParams();

  const {
    data: videoList,
    isLoading,
    isError,
<<<<<<< HEAD
  } = useQuery('videoList', fetchVideoList);
=======
  } = useQuery(['videoList', id], () => fetchVideoList(id));
>>>>>>> 423eb3c082755dc9ab7427d6775ec9a65cf03562

  const getVideoUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return (
      searchParams.get('videoUrl') || 'http://127.0.0.1:8000/api/v1/videos/1'
    ); // Default URL
  };
  const aspectRatio = 9 / 16; // 비디오 비율 (9:16)
  const maxWidth = 1280; // 최대 너비
  const maxHeight = maxWidth * aspectRatio; // 최대 높이

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const btnRef = useRef();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
<<<<<<< HEAD

  return (
    <>
      <LectureHeader />
      <Flex justifyContent="space-between">
        <Box
          width="100%"
          maxWidth={`${maxWidth}px`}
          position="relative"
          paddingTop={`calc(100% * ${aspectRatio})`}
          maxHeight={`${maxHeight}px`}
          margin="auto"
          overflow="hidden"
        >
          <ReactPlayer
            className="react-player"
            style={{ position: 'absolute', top: 0, left: 0 }}
            width="100%" // 플레이어 크기 (가로)
            height="100%" // 플레이어 크기 (세로)
            url={getVideoUrl()}
            playing={true} // 자동 재생 on
            muted={true} // 자동 재생 on
            loop={false} // 무한 반복 여부
            controls={true} // 플레이어 컨트롤 노출 여부
            light={false} // 플레이어 모드
            pip={true} // pip 모드 설정 여부
            played={playedSeconds}
            onProgress={handleProgress}
            onReady={handlePlayerReady}
            onDuration={handleDuration} //영상길이
            config={{
              youtube: {
                playerVars: {
                  origin: window.location.origin,
=======
  if (videoList) {
    console.log('videoList', videoList);
    return (
      <>
        <LectureHeader />
        <Flex justifyContent="space-between">
          <Box
            width="100%"
            maxWidth={`${maxWidth}px`}
            position="relative"
            paddingTop={`calc(100% * ${aspectRatio})`}
            maxHeight={`${maxHeight}px`}
            margin="auto"
            overflow="hidden"
          >
            <ReactPlayer
              className="react-player"
              style={{ position: 'absolute', top: 0, left: 0 }}
              width="100%" // 플레이어 크기 (가로)
              height="100%" // 플레이어 크기 (세로)
              url={videoList[0].videoFile}
              playing={true} // 자동 재생 on
              muted={true} // 자동 재생 on
              loop={false} // 무한 반복 여부
              controls={true} // 플레이어 컨트롤 노출 여부
              light={false} // 플레이어 모드
              pip={true} // pip 모드 설정 여부
              played={playedSeconds}
              onProgress={handleProgress}
              onReady={handlePlayerReady}
              onDuration={handleDuration} //영상길이
              config={{
                youtube: {
                  playerVars: {
                    origin: window.location.origin,
                  },
>>>>>>> 423eb3c082755dc9ab7427d6775ec9a65cf03562
                },
              }}
            />
          </Box>
          <Button ref={btnRef} colorScheme="ghost" onClick={handleDrawerOpen}>
            {<BsListUl size={35} style={{ color: 'black' }} />}
          </Button>
        </Flex>

        <Drawer
          isOpen={isDrawerOpen}
          placement="right"
          onClose={handleDrawerClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                <Box fontSize="24">목차</Box>
                <Box>강의 제목</Box>
                <Box fontSize="14">진도율 : 3강/18강 (16.67%)</Box>
                <Box fontSize="14">시간 : 18분/2시간 37분</Box>
                <Box>프로그레스바~~</Box>
              </DrawerHeader>

              <DrawerBody width="100%">
                <Box width="100%" bg="gray.100">
                  Chapter
                </Box>
              </DrawerBody>

              <DrawerFooter></DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </>
    );
  }
};

export default Video;
