import React from "react";
import { motion, AnimatePresence } from 'framer-motion'
import close from '../../assets/Icons/close.svg'
import upgrage from '../../assets/Icons/upgrade.svg'

const PopupModal = ({ title, content, buttonText, modalOpen, onCloseHandler, children }) => {
  return (
    <div
    onClick={onCloseHandler}
    className="backdrop w-full h-full fixed flex items-center justify-center z-[9999] top-[0px] left-0">
        <motion.div
        initial={{ opacity: 0, y: '2rem' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "2rem" }}
        transition={{ duration: 0.3, ease: [0.19, 0.46, 0.74, 0.9] }}
          onClick={(e) => e.stopPropagation()}
          className="relative popup-card flex flex-wrap  drop-shadow-[0_0px_35px_rgba(0,0,0,0.55)] rounded-md bg-[white] text-textPrimary py-5 px-5 max-w-md w-[80%]">
          <button id="close-btn" className="absolute right-3 top-5" onClick={onCloseHandler}>
            <img src={close} width="20px" height="20px"></img>
          </button>
          <div className="mr-2 grid grid-cols-1 gap-3">
            <h3 className="font-bold leading-none text-[18px]">{title}</h3>
            <p className="text-justify">{content}</p>
            {buttonText &&
              <a
                // className="mt-2 block bg-danger text-[white]  text-[14px] rounded px-4 py-2"
                className="py-[9px] px-[9px] bg-primary text-textLight text-[13px] font-lg font-bold rounded-md flex gap-2 w-fit"
                href='https://linkcollect.lemonsqueezy.com/' target="_blank"
              >
                <img src={upgrage} alt="butttonImg" />
                {buttonText}</a>}
            {children}
          </div>
        </motion.div>
    </div>
      // </AnimatePresence>
  )
}

export default PopupModal;