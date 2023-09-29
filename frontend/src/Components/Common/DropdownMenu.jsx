import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext } from 'react';

const DropdownContext = createContext();
export const DropdownMenu = ({ children, TriggerElement, isOpen, handleItemClick }) => {

    return (

        <div className='relative flex flex-col'>
            <TriggerElement />
            <DropdownContext.Provider value={{ handleItemClick }}>
                <AnimatePresence>
                    {
                        isOpen &&
                        <motion.div initial={{ opacity: 0, y: '-30px' }}
                                    animate={{ opacity: 1, y: '10px' }}
                                    exit={{ opacity: 0, y: '0px' }}
                        >

                            <div
                                className='qinqii-thin-shadow z-11 absolute  w-[200px] bg-white overflow-hidden rounded-[10px]'>
                                <div className='p-[10px]'>
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </DropdownContext.Provider>

        </div>
    );
};





export const DropdownItem = ({ children, cb }) => {
    const { handleItemClick } = useContext(DropdownContext); // this one is default handler for dropdown item
    const Callback = () => {
        handleItemClick()
        cb();//this one is additional function
    }
    return (
        <div className={`p-[10px] relative z-10 cursor-pointer hover:bg-[#E53935] group`}
             onClick={Callback}>
            <div className=" flex justify-between items-center ">
                {children}
            </div>
        </div>

    )
}

