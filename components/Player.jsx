import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  SwitchHorizontalIcon,
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)
  const [shuffle, setShuffle] = useState(false)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('Now playing: ', data.body?.item)
        setCurrentTrackId(data.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const handleShuffle = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.shuffle_state) {
        spotifyApi.setShuffle(false)
        setShuffle(false)
      } else {
        spotifyApi.setShuffle(true)
        setShuffle(true)
      }
    })
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log(data)
      if (data.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log(err)
      })
    }, 300),
    []
  )

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-xs">{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center justify-evenly">
          <SwitchHorizontalIcon
            onClick={handleShuffle}
            className={`button ${shuffle && 'text-green-500'}`}
          />
          <RewindIcon
            /*  onClick={() => spotifyApi.skipToPrevious()} */
            className="button"
          />
          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button-lg" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button-lg" />
          )}

          <FastForwardIcon
            onClick={() => spotifyApi.skipToNext()}
            className="button"
          />
          <ReplyIcon className="button" />
        </div>
        <input type="range" className="w-100" name="" id="" />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end space-x-3 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  )
}

export default Player
