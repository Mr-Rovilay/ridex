"use client"
import { getSocket } from '@/lib/socket';
import React, { useEffect, useRef } from 'react'

const GeoUpdater = ({ userId }: { userId: string }) => {
    const socketRef = useRef<any>(null)
    useEffect(()=> {
        if(!userId)return;
        if(!navigator.geolocation)return;
        socketRef.current = getSocket()
        socketRef.current.emit("identity", {data:userId})
    },[userId])
  return null
}

export default GeoUpdater