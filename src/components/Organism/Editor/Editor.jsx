import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
  Stack,
  Flex,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Text,
  Textarea,
  Tr,
  Th,
  Td,
  Tooltip,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Spacer,
  Grid,
  GridItem,
  InputGroup,
  InputRightAddon,
  TableContainer,
} from '@chakra-ui/react';
import './Editor.scss';

import { useContext, useEffect, useState } from 'react';
import { InvoiceContext } from '../../../core/InvoiceContext';
import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';
import * as BiIcons from 'react-icons/bi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Editor() {
  const {
    invoice,
    setInvoice,
    items,
    setItems,
    invoiceItems,
    setInvoiceItems,
    image,
    setImage,
    imageSize,
    setImageSize,
  } = useContext(InvoiceContext);
  console.log(invoice);
  // getting invoice data from localstorage

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editItem, setEditItem] = useState({
    editIndex: null,
    editName: '',
    editQuantity: '',
    editPrice: '',
  });

  useEffect(() => {
    localStorage.setItem('invoice', JSON.stringify(invoice));
    localStorage.setItem('items', JSON.stringify(items));
    if (image !== null) {
      localStorage.setItem('image', image);
      localStorage.setItem('imageSize', imageSize);
    }
  }, [invoice, items, image, imageSize]);

  // add invoice function is used to add invoice to local storage

  const addInvoice = e => {
    e.preventDefault();
    console.log(invoice);
    localStorage.setItem('invoice', JSON.stringify(invoice));
    toast('✅ Your data is saved', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // add invoice items
  const addInvoiceItem = e => {
    e.preventDefault();
    if (localStorage.getItem('items')) {
      if (
        invoiceItems.itemName &&
        invoiceItems.itemPrice &&
        invoiceItems.itemQuantity !== ''
      ) {
        if (invoiceItems.itemPrice >= 0 && invoiceItems.itemQuantity >= 0) {
          const item = [
            ...items, // spread operator
            {
              itemName: invoiceItems.itemName,
              itemQuantity: invoiceItems.itemQuantity,
              itemPrice: invoiceItems.itemPrice,
              itemTotal: invoiceItems.itemPrice * invoiceItems.itemQuantity,
            },
          ];
          localStorage.setItem('items', JSON.stringify(item));
          setItems(item);
        } else {
          toast('Please enter values greater than zero.', {
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        toast('Please add input ', {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      const item = [
        {
          itemName: invoiceItems.itemName,
          itemQuantity: invoiceItems.itemQuantity,
          itemPrice: invoiceItems.itemPrice,
          itemTotal: invoiceItems.itemPrice * invoiceItems.itemQuantity,
        },
      ];
      localStorage.setItem('items', JSON.stringify(item));
      setItems(item);
    }
  };

  // Upload Image in localstorage starts

  const imageUpload = e => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      localStorage['fileBase64'] = base64;
      console.debug('file stored', base64);
      setImage(base64);
      localStorage.setItem('image', base64);
    });
    toast('😎 Comapny Logo Uploaded', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };
  // Upload Image in localstorage ends

  /* Edit Invoice Item Starts */
  const EditInvoiceItem = index => {
    onOpen();
    setEditItem({
      editIndex: index,
      editName: items[index].itemName,
      editQuantity: items[index].itemQuantity,
      editPrice: items[index].itemPrice,
    });
  };

  // save edit items to localstorage
  const saveEditItem = () => {
    const newItems = items.map((item, index) => {
      if (index === editItem.editIndex) {
        return {
          itemName: editItem.editName,
          itemQuantity: editItem.editQuantity,
          itemPrice: editItem.editPrice,
          itemTotal: editItem.editPrice * editItem.editQuantity,
        };
      }
      return item;
    });
    localStorage.setItem('items', JSON.stringify(newItems));
    setItems(newItems);
    onClose();
  };

  /* Edit Invoice Item Ends */

  /*Delete invoice items from local storage starts */

  const removeInvoiceItem = index => {
    const item = [...items];
    item.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(item));
    setItems(item);
  };

  /* Delete invoice items from local storage ends */

  /* Edit Image Size */

  const [sliderValue, setSliderValue] = useState(50);
  const [isOpenPop, setIsOpenPop] = useState(false);
  const open = () => setIsOpenPop(!isOpen);
  const close = () => setIsOpenPop(false);
  console.log(sliderValue);

  /* Clear ALL Data Starts */
  const clearAllData = () => {
    localStorage.removeItem('invoice');
    localStorage.removeItem('items');
    localStorage.removeItem('image');
    localStorage.removeItem('imageSize');
    localStorage.removeItem('fileBase64');
    setInvoice({
      yourCompany: '',
      yourName: '',
      yourAddress: '',
      yourCity: '',
      yourWebsite: '',
      yourEmail: '',
      yourPhone: '',
      yourBank: '',
      yourAccountNumber: '',
      yourBankBranch: '',

      clientName: '',
      clientAddress: '',
      clientCity: '',
      clientWebsite: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',

      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',

      notes: {
        note: '',
        noteToggle: true,
      },
      terms: {
        term: '',
        termToggle: true,
      },
    });
    setItems([]);
    setImage('');
    setImageSize('150');
    toast('😈 All cleared', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Styles for the editor
  const backgroundColor =
    useColorModeValue('gray.100', 'gray.700') || 'gray.200';

  const textColor = useColorModeValue('gray.800', 'gray.200') || 'gray.800';

  return (
    <>
      {/* Upload Company Logo Starts */}
      <Stack spacing={4}>
        <Box>
          <Popover isOpen={isOpenPop} onClose={close} placement="top-start">
            <PopoverTrigger>
              {image ? (
                <Flex>
                  <Image
                    src={image}
                    alt="company logo"
                    className="company-logo"
                    style={{
                      borderRadius: '10px',
                      marginBottom: '10px',
                    }}
                    w={imageSize}
                    h={imageSize}
                    onClick={() => {
                      document.getElementById('uploadFile').click();
                    }}
                  />{' '}
                  <Menu>
                    <Tooltip label="Edit Image">
                      <MenuButton
                        m={2}
                        as={IconButton}
                        aria-label="Options"
                        icon={<RiIcons.RiMenu3Fill />}
                        variant="outline"
                      />
                    </Tooltip>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          document.getElementById('uploadFile').click();
                        }}
                        icon={<RiIcons.RiUpload2Fill />}
                      >
                        Upload Image
                      </MenuItem>
                      <MenuItem
                        icon={<MdIcons.MdPhotoSizeSelectLarge />}
                        onClick={open}
                      >
                        Resize Logo
                      </MenuItem>{' '}
                      <MenuItem
                        icon={<RiIcons.RiDeleteBin3Line />}
                        onClick={() => {
                          localStorage.removeItem('image');
                          setImage('');
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              ) : (
                <Center
                  w="200px"
                  h="200px"
                  style={{
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: '4px dotted #eaeaea',
                  }}
                  onClick={() => {
                    document.getElementById('uploadFile').click();
                  }}
                >
                  Add Logo
                </Center>
              )}
            </PopoverTrigger>
            <PopoverContent w={300}>
              <PopoverHeader fontWeight="semibold">Resize Logo</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Center>
                  <Slider
                    mb={7}
                    aria-label="slider-ex-3"
                    defaultValue={localStorage.getItem('imageSize')}
                    orientation="horizontal"
                    colorScheme={'purple'}
                    maxW="200"
                    min={100}
                    max={250}
                    onChange={v => {
                      setSliderValue(v);
                      localStorage.setItem('imageSize', v);
                      setImageSize(v);
                    }}
                    _hover={{
                      cursor: 'grab',
                    }}
                  >
                    <SliderMark value={100} mt="3" ml="-2.5" fontSize="sm">
                      100px
                    </SliderMark>{' '}
                    <SliderMark value={150} mt="3" ml="-2.5" fontSize="sm">
                      150px
                    </SliderMark>{' '}
                    <SliderMark value={200} mt="3" ml="-2.5" fontSize="sm">
                      200px
                    </SliderMark>{' '}
                    <SliderMark value={250} mt="3" ml="-2.5" fontSize="sm">
                      250px
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb
                      boxSize={6}
                      _hover={{
                        cursor: 'grab',
                      }}
                    >
                      <FaIcons.FaPaperPlane color="black" fontSize={10} />
                    </SliderThumb>
                  </Slider>
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Image Size Slider  */}

          <input
            id="uploadFile"
            type="file"
            name="image"
            className="img"
            onChange={e => imageUpload(e)}
          />
        </Box>
      </Stack>
      {/* User Details Starts  */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} my="5">
        <Box>
          <FormControl id="firstName">
            <FormLabel>Your Name</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Name"
              value={invoice.yourName}
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              onChange={e =>
                setInvoice({ ...invoice, yourName: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="youremail">
            <FormLabel>Your Email</FormLabel>
            <Input
              type="email"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Email"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourEmail}
              onChange={e =>
                setInvoice({ ...invoice, yourEmail: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="yourphone">
            <FormLabel>Your Phone</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Phone"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourPhone}
              onChange={e =>
                setInvoice({ ...invoice, yourPhone: e.target.value })
              }
            />
          </FormControl>
        </Box>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} my="5">
        <Box>
          <FormControl id="yourcompany">
            <FormLabel>Your Company</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Company"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourCompany}
              onChange={e =>
                setInvoice({ ...invoice, yourCompany: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="youraddress">
            <FormLabel>Your Address</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Address"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourAddress}
              onChange={e =>
                setInvoice({ ...invoice, yourAddress: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="yourcity">
            <FormLabel>Your City</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your City"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourCity}
              onChange={e =>
                setInvoice({ ...invoice, yourCity: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="yourwebsite">
            <FormLabel>Your Website</FormLabel>

            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Website"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourWebsite}
              onChange={e =>
                setInvoice({ ...invoice, yourWebsite: e.target.value })
              }
            />
          </FormControl>
        </Box>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} my="5">
        <Box>
          <FormControl id="yourAccount">
            <FormLabel>Your Account Number</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Account Number"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourAccountNumber}
              onChange={e =>
                setInvoice({ ...invoice, yourAccountNumber: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="yourBank">
            <FormLabel>Your Bank</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Bank"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourBank}
              onChange={e =>
                setInvoice({ ...invoice, yourBank: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="yourBankBranch">
            <FormLabel>Your Bank Branch</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Your Bank Branch"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.yourBankBranch}
              onChange={e =>
                setInvoice({ ...invoice, yourBankBranch: e.target.value })
              }
            />
          </FormControl>
        </Box>
      </Stack>
      {/* User Details End */}
      {/* Client Details Starts  */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} mt="20">
        <Box>
          <FormControl id="clientName">
            <FormLabel>Client Name</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client Name"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientName}
              onChange={e =>
                setInvoice({ ...invoice, clientName: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="clientEmail">
            <FormLabel>Client Email</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client Email"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientEmail}
              onChange={e =>
                setInvoice({ ...invoice, clientEmail: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="clientPhone">
            <FormLabel>Client Phone</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client Phone"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientPhone}
              onChange={e =>
                setInvoice({ ...invoice, clientPhone: e.target.value })
              }
            />
          </FormControl>
        </Box>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} my="5">
        <Box>
          <FormControl id="clientCompany">
            <FormLabel>Client Company</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client Company"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientCompany}
              onChange={e =>
                setInvoice({ ...invoice, clientCompany: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="clientAddress">
            <FormLabel>Client Address</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client Address"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientAddress}
              onChange={e =>
                setInvoice({ ...invoice, clientAddress: e.target.value })
              }
            />
          </FormControl>
        </Box>

        <Box>
          <FormControl id="clientCity">
            <FormLabel>Client City</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client City"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientCity}
              onChange={e =>
                setInvoice({ ...invoice, clientCity: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="clientWebsite">
            <FormLabel>Client Website</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Client Website"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.clientWebsite}
              onChange={e =>
                setInvoice({ ...invoice, clientWebsite: e.target.value })
              }
            />
          </FormControl>
        </Box>
      </Stack>
      {/* Clinet Details End */}
      {/* Invoice Number And Dates Starts */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} my="20">
        <Box>
          <FormControl id="invoiceNumber">
            <FormLabel>Invoice Number</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Invoice Number"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.invoiceNumber}
              onChange={e =>
                setInvoice({ ...invoice, invoiceNumber: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="invoiceDate">
            <FormLabel>Invoice Date</FormLabel>
            <Input
              type="date"
              size={'lg'}
              htmlSize={30}
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.invoiceDate}
              onChange={e =>
                setInvoice({ ...invoice, invoiceDate: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="dueDate">
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              size={'lg'}
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.dueDate}
              onChange={e =>
                setInvoice({ ...invoice, dueDate: e.target.value })
              }
            />
          </FormControl>
        </Box>
      </Stack>
      {/* Invoice Number And Dates End */}
      {/* Invoice Items Starts */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} my="20">
        <Box>
          <FormControl id="itemName">
            <FormLabel>Item Name</FormLabel>
            <Input
              type="text"
              size={'lg'}
              htmlSize={30}
              placeholder="Item Name"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoiceItems.itemName}
              onChange={e =>
                setInvoiceItems({ ...invoiceItems, itemName: e.target.value })
              }
            />
          </FormControl>
        </Box>

        <Box>
          <FormControl id="itemQuantity">
            <FormLabel>Item Quantity</FormLabel>
            <Input
              type="number"
              size={'lg'}
              width="100%"
              placeholder="Item Quantity"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoiceItems.itemQuantity}
              onChange={e =>
                setInvoiceItems({
                  ...invoiceItems,
                  itemQuantity: e.target.value,
                })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl id="itemPrice">
            <FormLabel>Item Price</FormLabel>
            <Input
              type="number"
              size={'lg'}
              width="100%"
              placeholder="Item Price"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoiceItems.itemPrice}
              onChange={e =>
                setInvoiceItems({ ...invoiceItems, itemPrice: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box pt={8}>
          <Button
            size={'lg'}
            variant="outline"
            bg={useColorModeValue('gray.100', 'gray.100')}
            color={useColorModeValue('gray.800', 'gray.800')}
            borderColor={useColorModeValue('gray.800', 'gray.800')}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.100'),
            }}
            onClick={addInvoiceItem}
          >
            Add Item
          </Button>
        </Box>
      </Stack>
      {/* Invoice Items End */}
      {/* Invoice Items List Starts */}
      <TableContainer mt="20" spacing={8}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Item Name</Th>
              <Th>Item Quantity</Th>
              <Th>Item Price</Th>
              <Th>Item Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr key={index}>
                <Td>{item.itemName}</Td>
                <Td>{item.itemQuantity} </Td>
                <Td>₹ {item.itemPrice}</Td>
                <Td>₹ {item.itemTotal}</Td>
                <Menu>
                  <Tooltip label="Edit Item">
                    <MenuButton
                      m={2}
                      as={IconButton}
                      aria-label="Options"
                      icon={<RiIcons.RiMenu3Fill />}
                      variant="outline"
                    />
                  </Tooltip>
                  <MenuList>
                    <MenuItem
                      icon={<FaIcons.FaRegEdit />}
                      onClick={() => EditInvoiceItem(index)}
                    >
                      Edit
                    </MenuItem>{' '}
                    <MenuItem
                      icon={<RiIcons.RiDeleteBin3Line />}
                      onClick={() => removeInvoiceItem(index)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item #{editItem.editIndex} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {' '}
            <Box>
              <FormControl id="editName">
                <FormLabel>Edit Item Name</FormLabel>
                <Input
                  type="text"
                  size={'lg'}
                  htmlSize={30}
                  placeholder="Edit Item Name"
                  bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
                  color={
                    useColorModeValue('gray.800', 'gray.300') || 'gray.800'
                  }
                  value={editItem.editName}
                  onChange={e =>
                    setEditItem({ ...editItem, editName: e.target.value })
                  }
                />
              </FormControl>
            </Box>{' '}
            <Box>
              <FormControl id="editQuantity">
                <FormLabel>Edit Item Quantity</FormLabel>
                <Input
                  type="number"
                  size={'lg'}
                  htmlSize={30}
                  placeholder="Edit Item Quantity"
                  bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
                  color={
                    useColorModeValue('gray.800', 'gray.300') || 'gray.800'
                  }
                  value={editItem.editQuantity}
                  onChange={e =>
                    setEditItem({ ...editItem, editQuantity: e.target.value })
                  }
                />
              </FormControl>
            </Box>{' '}
            <Box>
              <FormControl id="editPrice">
                <FormLabel>Edit Item Price</FormLabel>
                <Input
                  type="number"
                  size={'lg'}
                  htmlSize={30}
                  placeholder="Edit Item Price"
                  bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
                  color={
                    useColorModeValue('gray.800', 'gray.300') || 'gray.800'
                  }
                  value={editItem.editPrice}
                  onChange={e =>
                    setEditItem({ ...editItem, editPrice: e.target.value })
                  }
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="primary"
              variant="outline"
              mr={3}
              onClick={saveEditItem}
            >
              {' '}
              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {items.length > 0 && (
        <Stack my={10}>
          <Flex>
            <Spacer />
            <Box align="end">
              <Grid gap={4}>
                <GridItem colSpan={2} h="10">
                  <FormControl id="invoiceTotal" mb={'20'}>
                    <FormLabel>Tax %</FormLabel>
                    <InputGroup>
                      <Input
                        type="number"
                        width="100%"
                        placeholder="Tax %"
                        value={invoice.tax}
                        bg={backgroundColor}
                        color={textColor}
                        onChange={e =>
                          setInvoice({ ...invoice, tax: e.target.value })
                        }
                      />
                      <InputRightAddon
                        bg={'purple.100'}
                        color={'gray.700'}
                        children={<RiIcons.RiPercentLine color="green.500" />}
                      />
                    </InputGroup>
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>
          </Flex>
        </Stack>
      )}
      {/* Invoice Items List End */}
      {/* Invoice Total Starts */}
      <Stack
        mt={{
          base: '10',
          md: '10',
        }}
      >
        <Box>
          <Text mb="8px">Add a Note : </Text>
          <Flex>
            <Textarea
              isDisabled={invoice.notes.noteToggle ? true : false}
              size={'lg'}
              placeholder="It was great doing business with you."
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.notes.note}
              onChange={e =>
                setInvoice({
                  ...invoice,
                  notes: { ...invoice.notes, note: e.target.value },
                })
              }
            />

            {
              // TOGGLE Icon button
              <Tooltip label={invoice.notes.noteToggle ? 'Show' : 'Hide'}>
                <IconButton
                  variant="outline"
                  aria-label="Options"
                  mx={2}
                  icon={
                    invoice.notes.noteToggle ? (
                      <BiIcons.BiHide />
                    ) : (
                      <BiIcons.BiShow />
                    )
                  }
                  onClick={() => {
                    setInvoice({
                      ...invoice,
                      notes: {
                        ...invoice.notes,
                        noteToggle: !invoice.notes.noteToggle,
                      },
                    });

                    console.log(invoice.notes.noteToggle);
                  }}
                />
              </Tooltip>
            }
          </Flex>
        </Box>
      </Stack>{' '}
      {/* Invoice Total Starts */}
      <Stack my={10}>
        <Box>
          <Text mb="8px">Terms & Condition : </Text>
          <Flex>
            <Textarea
              isDisabled={invoice.terms.termToggle ? true : false}
              size={'lg'}
              placeholder="Please make the payment by the due date"
              bg={useColorModeValue('gray.100', 'gray.700') || 'gray.200'}
              color={useColorModeValue('gray.800', 'gray.300') || 'gray.800'}
              value={invoice.terms.term}
              onChange={e =>
                setInvoice({
                  ...invoice,
                  terms: { ...invoice.terms, term: e.target.value },
                })
              }
            />
            {
              // TOGGLE Icon button
              <Tooltip label={invoice.terms.termToggle ? 'Show' : 'Hide'}>
                <IconButton
                  variant="outline"
                  aria-label="Options"
                  mx={2}
                  icon={
                    invoice.terms.termToggle ? (
                      <BiIcons.BiHide />
                    ) : (
                      <BiIcons.BiShow />
                    )
                  }
                  onClick={() => {
                    setInvoice({
                      ...invoice,
                      terms: {
                        ...invoice.terms,
                        termToggle: !invoice.terms.termToggle,
                      },
                    });

                    console.log(invoice.terms.termToggle);
                  }}
                />
              </Tooltip>
            }
          </Flex>
        </Box>
      </Stack>
      {/* Save Button */}
      <Flex>
        <Box mt={8}>
          <Button
            fontWeight={600}
            color={'white'}
            bg={'purple.400'}
            borderRadius={'lg'}
            href={'#'}
            _hover={{
              bg: 'purple.700',
            }}
            onClick={addInvoice}
            rightIcon={<RiIcons.RiSaveLine />}
          >
            Save
          </Button>
        </Box>
        <Spacer />
        <Box mt={8}>
          <Button
            fontWeight={600}
            color={'black'}
            bg={'white'}
            borderRadius={'lg'}
            href={'#'}
            _hover={{
              bg: 'whiteAlpha.800',
            }}
            onClick={clearAllData}
            rightIcon={<RiIcons.RiDeleteBin2Line />}
          >
            Clear All
          </Button>
        </Box>
      </Flex>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
