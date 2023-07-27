import React, {useRef, useState} from 'react';
import {ImageList, ImageListItem} from "@mui/material";
import ImageSliderModal from "./ImageSliderModal";

interface ImageBlockProps {
    images: string[]
}

const ImageBlock = ({images}: ImageBlockProps) => {
    let len = images.length
    const [openImageModal, setOpenImageModal] = useState<boolean>(false)
    const [currentImage, setCurrentImage] = useState(0);


    function openModal() {
        setOpenImageModal(true)
    }

    function closeModal() {
        setOpenImageModal(false)
    }

    function nextImage() {
        setCurrentImage((x) => ((x + 1) % len))
    }

    function prevImage() {
        setCurrentImage((x) => ((x + len - 1) % len))
    }

    function findNumberOfCols(index: number): number {
        if (index == 0) {
            if (len == 4 || len % 2 == 1) return 12
            else return 6
        } else if (index == 1 && len != 4 && len % 2 == 0 || len == 3) return 6
        else if (len == 4 || len == 7 || len == 8) return 4
        return 3
    }


    return (
        <>
            <ImageList cols={12} rowHeight={25} variant="quilted">
                {images.map((item, index) => (
                    <ImageListItem key={item} cols={findNumberOfCols(index)} rows={findNumberOfCols(index)}>
                        <img
                            src={`{item}&fit=crop`}
                            srcSet={item}
                            alt="Error loading"
                            loading="lazy"
                            onClick={() => {openModal(); setCurrentImage(index)}}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <ImageSliderModal open={openImageModal} onClose={closeModal} images={images} currentImage={currentImage}
                              nextImage={nextImage} prevImage={prevImage} children={<></>}/>
        </>

    )
}

export default ImageBlock