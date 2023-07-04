import * as React from "react"
import {
    Box,
    Button, ButtonGroup,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel, Grid, IconButton, InputAdornment,
    OutlinedInput,
    styled,
    TextField, Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {ChangeEvent, useRef, useState} from "react"
import UploadFileIcon from '@mui/icons-material/UploadFile'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ModalDelete from "./components/ModalDelete"

export interface PostData {
    title: string
    text: string
    photos?: File[]
    video?: File
    commentsAllowed: boolean
    variantsAllowed?: boolean
    variants?: string[]
    createdAt: Date
    updatedAt: Date
    likes: 0
    dislikes: 0
}

const CustomFormControl = styled(FormControl)(() => ({
    marginTop: '10px',
    marginBottom: '10px',
    '& label': {
        color: 'black',
        letterSpacing: 0.5,
        textIndent: 5,
        marginBottom: '5px'
    }
}))

const CustomFormGroup = styled(FormGroup)(() => ({
    marginTop: '10px',
    marginBottom: '10px',
    '& label': {
        color: 'black',
        letterSpacing: 0.5,
        textIndent: 5,
        marginBottom: '5px'
    }
}))

export const WritePost = () => {
    const [variants, setVariants] = useState<string[]>(["", ""])
    const [photos, setPhotos] = useState<File[]>([])
    const photosRef = useRef<HTMLInputElement>(null)
    const [photoModal, setPhotoModal] = useState<boolean>(false)
    const [photoForDeleting, setPhotoForDeleting] = useState<File | null>(null)
    const [draggablePhoto, setDraggablePhoto] = useState<File | null>(null)
    const [formData, setFormData] = useState<PostData>({title: '', text: '', commentsAllowed: true, variantsAllowed: true});

    const [video, setVideo] = useState<File | null>(null)
    const videoRef = useRef<HTMLInputElement>(null)



    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        if (variants.filter(x => x != '').length > 0) {
            formData.variants = variants.filter(x => x != '')
            formData.variantsAllowed = true
        }
        if (photos.length > 0) formData.photos = photos
        if (video) formData.video = video

        console.log(formData)
    }

    const handleDragOverFiles = (e: React.DragEvent): void => {
        e.preventDefault()
    }

    const dragStartHandlerPhoto = (e: React.DragEvent, photo: File): void => {
        setDraggablePhoto(photo)
    }

    const dragEndHandlerFile = (e: React.DragEvent): void => {
        const target = e.target as HTMLElement

        if (target) {
            target.style.opacity = '1'
            target.style.transform = 'translateX(0px)'
        }
    }

    const dragOverHandlerFile = (e: React.DragEvent): void => {
        e.preventDefault()

        const target = e.target as HTMLElement
        if (target) {
            target.style.opacity = '0.2'
            target.style.transform = 'translateX(-10%)'
        }
    }

    const dropHandlerPhoto = (e: React.DragEvent, thisPhoto: File): void => {
        e.preventDefault()
        e.stopPropagation()

        const target = e.target as HTMLElement
        if (target) {
            target.style.opacity = '1'
            target.style.transform = 'translateX(0px)'
        }

        const dropIndex = photos.indexOf(thisPhoto)



        if (draggablePhoto) {
            const draggableIndex = photos.indexOf(draggablePhoto)
            if (draggableIndex > dropIndex) {
                setPhotos([...photos.slice(0, dropIndex+1), draggablePhoto, ...photos.slice(dropIndex+1, draggableIndex), ...photos.slice(draggableIndex+1)])
            }
            else if (draggableIndex < dropIndex) {
                setPhotos([...photos.slice(0, draggableIndex), ...photos.slice(draggableIndex+1, dropIndex + 1), draggablePhoto, ...photos.slice(dropIndex+1)])
            }
            setDraggablePhoto(null)
        }
        else {
            const dropFiles: File[] = Array.from(e.dataTransfer.files).map((item) => {
                let newFile: File = new File([item], URL.createObjectURL(item), {type: item.type, lastModified: item.lastModified})
                return newFile
            })
            setPhotos([...photos.slice(0, dropIndex+1), ...dropFiles, ...photos.slice(dropIndex+1)])
        }



        console.log('drop', thisPhoto)
    }

    const openPhotoExplorer = (e: React.SyntheticEvent): void => {
        if (photosRef.current != null) {
            photosRef.current.click()
        }
    }

    const openVideoExplorer = (e: React.SyntheticEvent): void => {
        if (videoRef.current != null) {
            videoRef.current.click()
        }
    }

    const handleExplorerPhotos = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        const filesFromExplorer: File[] = []
        if (e.target.files != null){
            for (const file of e.target.files) {
                filesFromExplorer.push(file as File)
            }
            const dropFiles: File[] = filesFromExplorer.map((item) => {
                let newFile: File = new File([item], URL.createObjectURL(item), {type: item.type, lastModified: item.lastModified})
                return newFile
            })
            setPhotos(oldArray => [...oldArray, ...dropFiles])
        }
    }

    const handleExplorerVideo = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        if (e.target.files != null) setVideo(e.target.files[0])
    }

    const handleDropPhotos = (e: React.DragEvent): void => {
        if (!draggablePhoto) {
            e.preventDefault()
            e.stopPropagation()
            const dropFiles: File[] = Array.from(e.dataTransfer.files).map((item) => {
                let newFile: File = new File([item], URL.createObjectURL(item), {type: item.type, lastModified: item.lastModified})
                return newFile
            })
            setPhotos(oldArray => [...oldArray, ...dropFiles])
        }
    }

    const handleDropVideos = (e: React.DragEvent): void => {
        e.preventDefault()
        e.stopPropagation()
        setVideo(e.dataTransfer.files[0])
    }

    const clearPhotosHandler = (): void => {
        setPhotos([])
    }

    const clearVideosHandler = (): void => {
        setVideo(null)
    }

    const deletePhoto = (file: File): void => {
        setPhotos(photos.filter(x => x.name != file.name))
    }
    
    const callModalWindow = (file: File) => {
        setPhotoForDeleting(file)
        setPhotoModal(true)
    }

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <Typography variant={"h3"} align={"center"}>
                    Create a post
                </Typography>
                <form onSubmit={handleSubmit}>
                    <CustomFormControl fullWidth>
                        <FormLabel htmlFor={"title"}>
                            Title
                        </FormLabel>
                        <TextField
                            id={"title"}
                            name={"title"}
                            type={"text"}
                            placeholder={"Enter a title"}
                            required
                            fullWidth
                        />
                    </CustomFormControl>
                    <CustomFormControl fullWidth>
                        <FormLabel htmlFor={"text"}>
                            Text
                        </FormLabel>
                        <TextField id={"text"} name={"text"} type={"text"} placeholder={"Enter a text"} multiline
                                   rows={12}
                                   maxRows={50} required fullWidth/>
                    </CustomFormControl>
                    <CustomFormGroup>
                        <FormLabel>
                            Photos
                        </FormLabel>
                        <Box
                            sx={{
                                border: '2px rgba(0, 0, 0, 0.25) dashed',
                                borderRadius: '10px',
                                minHeight: '200px',
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: '24px',
                                color: "rgba(0, 0, 0, 0.5)",
                                mb: '10px',
                            }}
                            onDrop={handleDropPhotos}
                            onDragOver={handleDragOverFiles}
                        >
                            <input type="file"
                                   multiple
                                   hidden
                                   accept="image/*"
                                   ref={photosRef}
                                   onChange={handleExplorerPhotos}
                            />
                            {photos.length==0 ?
                                <Grid container sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 1,
                                }}>Upload photos&nbsp;<AddPhotoAlternateIcon/></Grid>
                                :
                                <Grid container sx={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    justifyContent: 'start',
                                    px: 1,
                                }}
                                    xs={12} sm={12} md={12} lg={12} xl={12}
                                >{photos.map((item) =>
                                    (<Grid onClick={() => callModalWindow(item)}
                                              sx={{ py: 1, pr: 2, cursor: 'grab' }}
                                              key={item.name} item xs={6} sm={6} md={4} lg={2} xl={2}
                                              draggable={true}
                                              onDragStart={(e: any) => dragStartHandlerPhoto(e, item)} // we've taken the photo
                                              onDragLeave={dragEndHandlerFile} // we've leaved this photo and gone to another photo
                                              onDragEnd={dragEndHandlerFile} // we've released the photo
                                              onDragOver={dragOverHandlerFile} // we are over another object
                                              onDrop={(e: any) => dropHandlerPhoto(e, item)}
                                        >
                                        <Box component={"img"} src={item.name} sx={{ aspectRatio: '4/3', objectFit: 'cover' }} width={'100%'} alt={item.name}/>
                                    </Grid>))}
                                </Grid>
                            }
                        </Box>
                        <FormControl fullWidth>
                            <ButtonGroup variant="contained" fullWidth>
                                <Button color={"error"} onClick={clearPhotosHandler}>Clear photos</Button>
                                <Button color={"info"} onClick={openPhotoExplorer}>Add new photos</Button>
                            </ButtonGroup>
                        </FormControl>
                    </CustomFormGroup>
                    <CustomFormGroup>
                        <FormLabel>
                            Video
                        </FormLabel>
                        <Box
                            sx={{
                                border: '2px rgba(0, 0, 0, 0.25) dashed',
                                borderRadius: '10px',
                                minHeight: '200px',
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: '24px',
                                color: "rgba(0, 0, 0, 0.5)",
                                mb: '10px',
                            }}
                            onDrop={handleDropVideos}
                            onDragOver={handleDragOverFiles}
                        >
                            <input type="file"
                                   hidden
                                   accept="video/*"
                                   ref={videoRef}
                                   onChange={handleExplorerVideo}
                            />

                                <Grid container sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 1,
                                }}>
                                    {!video ?
                                    <>Upload a video&nbsp;<UploadFileIcon/></>
                                    :
                                    <Grid onClick={() => callModalWindow(video)}
                                           sx={{ py: 1, pr: 2, cursor: 'grab' }}
                                    >
                                        {/*<video*/}
                                        {/*    autoPlay*/}
                                        {/*    loop*/}
                                        {/*    muted*/}
                                        {/*>*/}
                                        {/*    <source*/}
                                        {/*        src={video.name}*/}
                                        {/*        type="video/mp4"*/}
                                        {/*    />*/}
                                        {/*</video>*/}
                                    </Grid>
                                    }
                                </Grid>

                        </Box>
                        <FormControl fullWidth>
                            <ButtonGroup variant="contained" fullWidth>
                                <Button color={"error"} onClick={clearVideosHandler}>Clear the video</Button>
                                <Button color={"info"} onClick={openVideoExplorer}>Change a video</Button>
                            </ButtonGroup>
                        </FormControl>
                    </CustomFormGroup>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked id={"commentsAllowed"} value={formData.commentsAllowed} onChange={() => setFormData({...formData, commentsAllowed: !formData.commentsAllowed })} />}
                            label="People can add comments to post"/>
                    </FormGroup>
                    <CustomFormGroup>
                        <FormLabel>
                            Poll
                        </FormLabel>
                        <FormControlLabel
                            control={<Checkbox id={"variantsAllowed"} disabled={variants.length <= 1} onChange={(e) => setFormData({...formData, variantsAllowed: !formData.variantsAllowed })} defaultChecked/>}
                            label="People can add variants"/>

                        {variants.map((item, index) => (
                            <OutlinedInput
                                type={'text'}
                                id={`variants[${index}]`}
                                sx={{my: 1}}
                                value={variants[index]}
                                onChange={(e) => {
                                    const copy = [...variants]
                                    copy[index] = e.target.value
                                    setVariants(copy)
                                }}
                                endAdornment={
                                    <InputAdornment position="end">

                                        {variants.length < 10 ?
                                            <IconButton onClick={() => {
                                                if (variants.length < 10) {
                                                    setVariants([...variants.slice(0, index + 1), "", ...variants.slice(index + 1, variants.length + 1)])
                                                }
                                            }}>
                                                <AddIcon/></IconButton>
                                            :
                                            null}

                                        {variants.length > 1 ?
                                            <IconButton onClick={() => {
                                                const firstHalf = variants.slice(0, index)
                                                const lastHalf = variants.slice(index + 1)
                                                const answer = firstHalf.concat(lastHalf)
                                                setVariants(answer)
                                            }}>
                                                <RemoveIcon/>
                                            </IconButton>
                                            :
                                            null
                                        }
                                    </InputAdornment>
                                }
                            />
                        ))}
                    </CustomFormGroup>
                    <FormControl fullWidth>
                        <Button variant="contained" type={"submit"}>Create a post</Button>
                    </FormControl>
                </form>
            </Grid>
            {photoForDeleting ? <ModalDelete show={photoModal} showModal={()=>setPhotoModal(prevState => !prevState)} file={photoForDeleting} deleteFile={deletePhoto} /> : ''}

        </Grid>


    )
}

export default WritePost