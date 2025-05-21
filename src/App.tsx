import React, { useEffect, useState } from 'react'
import { DeskThing } from '@deskthing/client'
import { AppSettings, SocketData } from '@deskthing/types'

const App: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>()
    const [message, setMessage] = useState<string>()
    useEffect(() => {
        const onAppData = async (data: SocketData) => {
            console.log('Received data from the server!')
            console.log(data.payload)
        }
        
        
        const initializeSettings = async () => {
            const settings = await DeskThing.getSettings()
            if (settings) {
                setSettings(settings)
            }
            DeskThing.send({ type: 'get', request: 'sampleData' })
        }
        const onAppSettings = async (data: SocketData) => {
            if (data.payload) {
                setSettings(data.payload)
            }
        }

        const onClientData = async (data: SocketData) => {
            console.log('Received data from the client!')
            setMessage(data.payload)
        }
        
        initializeSettings()
        
        const removeDataListener = DeskThing.on('data', onAppData)
        const removeSettingsListener = DeskThing.on('settings', onAppSettings)
        const removeClientListener = DeskThing.on('sampleData', onClientData)

        return () => {
            removeDataListener()
            removeSettingsListener()
            removeClientListener()
        }
    }, [])

    return (
        <div className="bg-slate-800 gap-2 flex-col w-screen h-screen flex justify-center items-center">
            <p className="font-bold text-5xl text-white">DeskThing App</p>
            <div className="text-2xl font-semibold">
                {settings ? (
                    <div style={{color: settings?.color?.value as string|| 'white'}}>On the client too!: {message|| 'unknown'}</div>
                ) : (
                    <p>Loading Settings</p>
                )}
            </div>
        </div>

    )
}

export default App
