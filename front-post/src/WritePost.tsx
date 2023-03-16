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
import {useRef, useState} from "react"
import UploadFileIcon from '@mui/icons-material/UploadFile'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import {AspectRatio} from "@mui/icons-material";
import ModalDelete from "./components/ModalDelete";
import {Simulate} from "react-dom/test-utils";
import dragStart = Simulate.dragStart;

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
    const [files, setFiles] = useState<File[]>([])
    const filesRef = useRef<HTMLInputElement>(null)
    const [modal, setModal] = useState<boolean>(false)
    const [fileForDeleting, setFileForDeleting] = useState<File | null>(null)
    const [draggablePhoto, setDraggablePhoto] = useState<File | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        console.log(variants)
    }

    const handleDragOverFiles = (e: React.DragEvent): void => {
        e.preventDefault()
    }

    const dragStartHandlerPhoto = (e: React.DragEvent, photo: File): void => {
        console.log('drag', photo)
        setDraggablePhoto(photo)
    }

    const dragEndHandlerPhoto = (e: React.DragEvent): void => {
        const target = e.target as HTMLElement

        if (target) {
            target.style.opacity = '1'
            target.style.transform = 'translateX(0px)'
        }
    }

    const dragOverHandlerPhoto = (e: React.DragEvent): void => {
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

        const dropIndex = files.indexOf(thisPhoto)



        if (draggablePhoto) {
            const draggableIndex = files.indexOf(draggablePhoto)
            if (draggableIndex > dropIndex) {
                setFiles([...files.slice(0, dropIndex+1), draggablePhoto, ...files.slice(dropIndex+1, draggableIndex), ...files.slice(draggableIndex+1)])
            }
            else if (draggableIndex < dropIndex) {
                setFiles([...files.slice(0, draggableIndex), ...files.slice(draggableIndex+1, dropIndex + 1), draggablePhoto, ...files.slice(dropIndex+1)])
            }
            setDraggablePhoto(null)
        }
        else {
            setFiles([...files.slice(0, dropIndex+1), ...Array.from(e.dataTransfer.files), ...files.slice(dropIndex+1)])
        }



        console.log('drop', thisPhoto)
    }

    const openFileExplorer = (): void => {
        if (filesRef.current != null) {
            filesRef.current.click()
        }
    }

    const handleExplorerFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        const filesFromExplorer: File[] = []
        if (e.target.files != null){
            for (const file of e.target.files) {
                filesFromExplorer.push(file)
                console.log(file)
            }
        }
        setFiles(oldArray => [...oldArray, ...filesFromExplorer])
    }

    const handleDropFiles = (e: React.DragEvent): void => {
        e.preventDefault()
        e.stopPropagation()
        setFiles(oldArray => [...oldArray, ...Array.from(e.dataTransfer.files)])
    }

    const clearPhotosHandler = (): void => {
        console.log(files)
        setFiles([])
    }

    const deletePhoto = (file: File): void => {
        setFiles(files.filter(x => x.name != file.name))
    }
    
    const callModalWindow = (file: File) => {
        setFileForDeleting(file)
        setModal(true)
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
                        <TextField id={"title"} name={"title"} type={"text"} placeholder={"Enter a title"} required
                                   fullWidth/>
                    </CustomFormControl>
                    <CustomFormControl fullWidth>
                        <FormLabel htmlFor={"text"}>
                            Text
                        </FormLabel>
                        <TextField id={"text"} name={"text"} type={"text"} placeholder={"Enter a text"} multiline
                                   rows={7}
                                   maxRows={25} required fullWidth/>
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
                            onDrop={handleDropFiles}
                            onDragOver={handleDragOverFiles}
                        >
                            <input type="file"
                                   multiple
                                   hidden
                                   ref={filesRef}
                                   onChange={(e: any) => setFiles(e.target.files)}
                            />
                            {files.length==0 ?
                                <>Upload photos&nbsp;<AddPhotoAlternateIcon/></> :
                                <Grid container sx={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    justifyContent: 'start',
                                    px: 1,
                                }}
                                    xs={12} sm={12} md={12} lg={12} xl={12}
                                >{
                                    files.map((item) =>
                                        <Grid onClick={() => callModalWindow(item)}
                                              sx={{ py: 1, pr: 2, ratio: 4/3, cursor: 'grab' }}
                                              key={item.name} item xs={6} sm={6} md={4} lg={2} xl={2}
                                              draggable={true}
                                              onDragStart={(e: any) => dragStartHandlerPhoto(e, item)} // we've taken the photo
                                              onDragLeave={dragEndHandlerPhoto} // we've leaved this photo and gone to another photo
                                              onDragEnd={dragEndHandlerPhoto} // we've released the photo
                                              onDragOver={dragOverHandlerPhoto} // we are over another object
                                              onDrop={(e: any) => dropHandlerPhoto(e, item)}
                                        >
                                        <img src={URL.createObjectURL(item)} width={'100%'} alt={item.name}/>
                                    </Grid>)
                                }</Grid>
                            }
                        </Box>
                        <FormControl fullWidth>
                            <ButtonGroup variant="contained" fullWidth>
                                <Button color={"error"} onClick={clearPhotosHandler}>Clear photos</Button>
                                <Button color={"info"} onClick={openFileExplorer}>Add new photos</Button>
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
                                height: '150px',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                color: "rgba(0, 0, 0, 0.5)"
                            }}
                        >
                            Upload a video&nbsp;<UploadFileIcon/>
                            <input
                                type="file"
                                hidden
                            />
                        </Box>
                    </CustomFormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked/>} label="People can add comments to post"/>
                    </FormGroup>
                    <CustomFormGroup>
                        <FormLabel>
                            Poll
                        </FormLabel>
                        <FormControlLabel
                            control={<Checkbox id={"poll"} disabled={variants.length <= 1} defaultChecked/>}
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
            {fileForDeleting ? <ModalDelete show={modal} showModal={()=>setModal(prevState => !prevState)} file={fileForDeleting} deleteFile={deletePhoto} /> : ''}

        </Grid>


    )
}

export default WritePost