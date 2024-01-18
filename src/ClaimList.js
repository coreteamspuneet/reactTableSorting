import {
    Box,
    Flex,
    HStack,
    Heading,
    IconButton,
    Input,
    Skeleton,
    InputGroup,
    InputLeftElement,
    Select,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
    Button,
    Text,
  } from '@chakra-ui/react';
  import React, { useContext, useEffect, useState } from 'react';
  import { AiOutlineCalendar, AiOutlineDownload, AiOutlineSearch } from 'react-icons/ai';
  import { MdArrowDropDown } from 'react-icons/md';
  import NoDataAvailable from '../../Molecules/NoData/NoDataAvailable';
  import ExportButton from '../../Atoms/ExportButton';
  import { ChevronDownIcon, ChevronUpIcon, EditIcon } from '@chakra-ui/icons';
  import { useLocation, useNavigate } from 'react-router-dom';
  import { Verifycontext } from '../../lib/Providers/LoginVeification';
  import ShowHistoryPopup from '../popups/ShowHistoryPopup';
  import axios from 'axios';
  import Config from '../../lib/Config/Config';
  import GlobalInputLabels from '../Global/GlobalInputLabels';
  import moment from 'moment';
  // const ClaimList = ({ claimlist, claimloading, search, setSearch, projectDetails }) => {
  const ClaimList = ({
    projectDetails,
    ProjectID,
    setClaimlist,
    claimlist,
    cardData,
    setCardData,
    status,
    setStatus,
    heading,
    clientProjectStatus,
    setClientProjectStatus,
    startAging,
    endAging,
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    const [next, setNext] = useState(0);
    console.log('useLocationlocation', location);
    const {
      Medata,
      manager_access,
      admin_access,
      superviser_access,
      employee_access,
    } = useContext(Verifycontext);
  
    const [ClaimID, setClaimID] = useState(null);
    // const [claimlist, setClaimlist] = useState([])
    const [claimloading, setClaimloading] = useState(false);
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(50);
    const [pageNumber, setPageNumber] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
  
    // const [hasMore, sethasMore] = useState(false);
  
    const GetClaimlist = async () => {
      if (ProjectID) {
        setClaimloading(true);
        // projectId: ProjectID,
        // searchTerm: '',
        try {
          const res = await axios.get(
            `${Config.Get_Claim_List_by_projectid}${ProjectID}`,
            {
              params: {
                searchTerm: search,
                pageNo: pageNumber,
                size: limit,
                employeeId: employee_access ? Medata?.userId : '',
                status: status,
                startDate: startDate,
                endDate: endDate,
                startaging: startAging,
                endaging: endAging,
              },
            }
          );
          // console.log('empresponse', res);
          if (res.status === 200) {
            // setClaimlist(res.data.data);
            // console.log('res?.data?.data.length > 0',res?.data?.data.length > 0);
            // console.log('dbksfhrofnlsndouempresponse', res?.data?.data);
  
            if (res?.data?.data?.claimsData.length === 0 || res?.data?.data?.claimsData?.claimsData === null) {
              setClaimlist([]);
            } else if (res?.data?.data?.claimsData.length > 0) {
              setClaimlist(res?.data?.data?.claimsData)
            }
            // } else if (typeof res?.data?.data?.claimsData === Object)
            // console.log('check',true);
            // setClaimlist([]);
          }
        } catch (error) {
          // console.log('error', error);
        } finally {
          setClaimloading(false);
        }
      }
    };
    useEffect(() => {
      GetClaimlist();
    }, [search, limit, pageNumber, status, endDate, startDate, ProjectID, startAging, endAging,]);
    // console.log('claimListdnsoohdo',);
  
    // console.log('dsdclaimlist', claimlist);
    // console.log('newformat', newformat);
  
    const MakeClaimSameOnExport = (claimlist) => {
      const newClaimList = claimlist?.map((data) => {
        const { account_number, action_code, aging, charge_amount, dos, employee_id, employee_name, id, lags, next_follow_up_date, patient_name, practice_name, project_id, provider_name, status_code, user_initials, user_notes, insuraance } = data || '';
        const newformat = {
          'PATIENT_NAME': patient_name,
          'ACCOUNT': account_number,
          'PRACTICE_NAME': practice_name,
          'PROVIDER_NAME': provider_name,
          'ASSIGN_TO': employee_name,
          'DOS': dos,
          'CHARGE_AMOUNT': charge_amount,
          'INSURANCE': insuraance,
          'LAG': lags,
          'AGING': aging,
          'USER_NOTES': user_notes,
          'STATUS_CODE': status_code,
          'ACTION_CODE': action_code,
          'USER_INITIALS': user_initials,
          'NEXT_FO_DATE': next_follow_up_date,
        }
        return newformat;
      })
      return newClaimList;
  
    }
  
    console.log('claimList_', claimlist);
  
    return (
      <>
        <ShowHistoryPopup
          ID={ClaimID}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
        <Box
        // border="solid 1px"
        // borderColor="gray.200"
        // rounded="lg"
        // bg="white.500"
        >
          <Flex
            overflowX="scroll"
            // border="solid 1px"
            // borderColor="gray.200"
            // rounded="lg"
            // bg="white.500"
            // position='sticky'
            // top='112'
            // // top='20'
            // zIndex='1'
            p={3}
            alignItems="center"
            justifyContent="space-between">
            <Flex alignItems="center" gap="2">
              <Heading fontSize="sm" color="brand.500">
                {heading || 'Claim List'}
              </Heading>
              <Tag color="white.500" bg="primary.500">
                {claimlist?.length || 0}
                {/* {cardData?.TotalClaims || 0} */}
              </Tag>
            </Flex>
            <HStack>
              <InputGroup width={380} gap='2'>
                {/* <InputLeftElement
                  pointerEvents="none"
                  children={<AiOutlineCalendar color="gray.300" />}
                /> */}
                <GlobalInputLabels text='Start date'>
                  {/* Start date */}
                  <Tooltip label='Start date'>
                    <Input
                      type="date"
                      onChange={e => {
                        setStartDate(e.target.value);
                      }}
                      value={startDate}
                    />
                  </Tooltip>
                </GlobalInputLabels>
                <GlobalInputLabels text='End date'>
                  {/* End date */}
                  <Tooltip label='End date'>
                    <Input
                      type="date"
                      onChange={e => {
                        setEndDate(e.target.value);
                      }}
                      value={endDate}
                    />
                  </Tooltip>
                </GlobalInputLabels>
              </InputGroup>
              <GlobalInputLabels text='Search' >
                {/* Search */}
                <Tooltip label='Search'>
                  <InputGroup width={160}>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<AiOutlineSearch color="gray.300" />}
                    />
                    <Input
                      type="text"
                      placeholder="Search..."
                      onChange={e => {
                        setSearch(e.target.value);
                      }}
                      value={search}
                    />
                  </InputGroup>
                </Tooltip>
              </GlobalInputLabels>
              <GlobalInputLabels text='Status'>
                <Tooltip label='Select status'>
                  <Select
                    onChange={e => setStatus(e?.target?.value)}
                    value={status}
                    fontSize="sm"
                    fontWeight={500}
                    width="158px"
                  //   h="25px"
                  >
                    <option value="total">Total</option>
                    <option value="incoming">Incoming</option>
                    <option value="inprogress">Inprogress</option>
                    <option value="nextFollowUp">Next Follow Up</option>
                    <option value="paid">Paid</option>
                  </Select>
                </Tooltip>
              </GlobalInputLabels>
              {admin_access ?
                <GlobalInputLabels text='Project Status' >
                  <Tooltip fontSize="sm" label="Select Project Status">
                    <Select
                      onChange={e => {
                        setClientProjectStatus(e.target.value);
                        console.log('Client_project_status', e.target.value);
                      }}
                      value={clientProjectStatus}
                      fontSize={14}
                      fontWeight={600}
                      width={130}
                      height={10}
                      icon={<MdArrowDropDown />}
                      textTransform="capitalize"
                    >
                      <option value="">all</option>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </Select>
                  </Tooltip>
                </GlobalInputLabels>
                :
                (manager_access || superviser_access || employee_access) ? null
                  :
                  null
              }
              <GlobalInputLabels text='Limit' >
                <Tooltip label='Select Limit'>
                  <Select
                    onChange={e => {
                      setLimit(e?.target?.value);
                    }}
                    value={limit}
                    fontSize="sm"
                    // fontWeight={500}
                    width="80px"
                  // h='25px'
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={300}>300</option>
                    <option value={400}>400</option>
                    <option value={500}>500</option>
                  </Select>
                </Tooltip>
              </GlobalInputLabels>
              <Text mt='1.4rem'>
                <ExportButton
                  exportData={MakeClaimSameOnExport(claimlist)} filename={'claimList'} />
              </Text>
              {/* <Tooltip fontSize='sm' label="CSV Export">
                              <IconButton
                                  fontSize='2xl'
                                  bg='primary.500'
                                  color='white.500'
                                  icon={<AiOutlineDownload color='white.500' />}
                              />
                          </Tooltip> */}
            </HStack>
          </Flex>
          <TableContainer className='scroll_port' maxH="70vh" overflowY="scroll">
            <Table variant="simple" className="table">
              <Thead>
                <Tr>
                  <Th color="brand.500">#</Th>
                  <Th color="brand.500">Patient Name<ChevronDownIcon /></Th>
                  <Th color="brand.500">Account<ChevronUpIcon /></Th>
                  <Th color="brand.500">Practice Name</Th>
                  <Th color="brand.500">Provider Name</Th>
                  {(manager_access || admin_access || superviser_access) && (
                    <Th color="brand.500">Assign To</Th>
                  )}
                  <Th color="brand.500">DOS</Th>
                  <Th color="brand.500">Charge Amount</Th>
                  <Th color="brand.500">Insurance</Th>
                  <Th color="brand.500">Lag</Th>
                  {/* <Th color='brand.500'>Lag</Th> */}
                  <Th color="brand.500">Aging</Th>
                  <Th color="brand.500">Activity Date</Th>
                  <Th color="brand.500">User Notes</Th>
                  <Th color="brand.500">Status Code</Th>
                  <Th color="brand.500">Action Code</Th>
                  {/* <Th color="brand.500">User Initials</Th> */}
                  {/* <Th color="brand.500">Activity Date</Th> */}
                  <Th color="brand.500">Next F/U Date</Th>
                  {(employee_access || superviser_access) && <Th color="brand.500">Action</Th>}
                </Tr>
              </Thead>
              {!claimloading && (
                <>
                  <Tbody>
                    {claimlist?.length > 0 &&
                      claimlist?.map((claim, index) => {
                        const {
                          project_id,
                          patient_name,
                          account_number,
                          practice_name,
                          provider_name,
                          employee_name,
                          dos,
                          charge_amount,
                          insuraance,
                          lags,
                          aging,
                          user_notes,
                          status_code,
                          action_code,
                          user_initials,
                          next_follow_up_date,
                          patientName,
                          accountNumber,
                          practiceName,
                          providerName,
                          chargeAmount,
                          userNotes,
                          statusCode,
                          actionCode,
                          userInitials,
                          nextFollowUpDate,
                          updated_at
                        } = claim || {};
                        return (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td
                              onClick={() => {
                                setClaimID(claim?.id);
                                onOpen();
                              }}
                              cursor="pointer"
                              color="primary.500"
                            >
                              {patient_name || patientName || '---'}
                            </Td>
                            <Td>{account_number || accountNumber || '---'}</Td>
                            <Td>{practice_name || practiceName || '---'}</Td>
                            <Td>{provider_name || providerName || '---'}</Td>
                            {(manager_access ||
                              admin_access ||
                              superviser_access) && (
                                <Td color="purple.500">{employee_name || '---'}</Td>
                              )}
                            {/* <Td><Tag bg="green.100" color='green.500' fontSize='xs'>Complete</Tag></Td> */}
                            <Td>{dos || '---'}</Td>
                            <Td>{charge_amount || chargeAmount || '---'}</Td>
                            <Td>{insuraance || '---'}</Td>
                            <Td>{lags || '---'}</Td>
                            <Td>{aging || '---'}</Td>
                            <Td>{moment(updated_at, 'YYYY/MM/DD').format('MM/DD/YYYY') || '---'}</Td>
                            <Td
                              onClick={() => {
                                setClaimID(claim?.id);
                                onOpen();
                              }}
                              cursor="pointer"
                              color="primary.500"
                            >
                              <Tooltip
                                color="primary.500"
                                bg="gray.200"
                                label={user_notes || userNotes || '---'}
                              >
                                {user_notes || userNotes ? ((user_notes || userNotes)?.slice(0, 20) +
                                  ' . . .') : '---'}
                              </Tooltip>
                            </Td>
                            {/* <Td>{user_notes || userNotes || '---'}</Td> */}
                            <Td
                              onClick={() => {
                                setClaimID(claim?.id);
                                onOpen();
                              }}
                              cursor="pointer"
                              color="primary.500"
                            >
                              {status_code || statusCode || '---'}
                            </Td>
                            <Td
                              onClick={() => {
                                setClaimID(claim?.id);
                                onOpen();
                              }}
                              cursor="pointer"
                              color="primary.500"
                            >
                              {action_code || actionCode || '---'}
                            </Td>
                            {/* <Td>{user_initials || userInitials || '---'}</Td> */}
                            {/* <Td>{moment(updated_at, 'YYYY/MM/DD').format('MM/DD/YYYY') || '---'}</Td> */}
                            <Td
                              onClick={() => {
                                setClaimID(claim?.id);
                                onOpen();
                              }}
                              cursor="pointer"
                              color="primary.500"
                            >
                              {next_follow_up_date || nextFollowUpDate || '---'}
                            </Td>
                            {(employee_access || superviser_access) && (
                              <Td
                                onClick={() => {
                                  const data = {
                                    projectDetails,
                                    claim,
                                  };
                                  navigate('/edit-task', { state: data });
                                }}
                              >
                                <Tooltip label="Edit">
                                  <IconButton
                                    aria-label="Edit Claims"
                                    color="primary.500"
                                    icon={<EditIcon />}
                                  />
                                </Tooltip>
                              </Td>
                            )}
                            {/* <Td>
                                          <Select color='yellow.300' fontSize={14} fontWeight={600} width={115} height={8} icon={<MdArrowDropDown />}>
                                              <option>Medium</option>
                                              <option>Low</option>
                                              <option>High</option>
                                              <option >Urgent</option>
                                          </Select>
                                      </Td> */}
                          </Tr>
                        );
                      })}
                  </Tbody>
                </>
              )}
            </Table>
          </TableContainer>
          {!claimloading && claimlist?.length !== 0 && (
            <Flex gap="4" py="4" px="4" alignItems="center" justifyContent="end">
              <Button
                isDisabled={pageNumber === 0}
                colorScheme="blue"
                onClick={() => {
                  setPageNumber(prev => prev - 1);
                }}
              >
                Previous
              </Button>
              <Button
                isDisabled={claimlist?.length < limit}
                colorScheme="blue"
                onClick={() => {
                  setPageNumber(prev => prev + 1);
                }}
              >
                Next
              </Button>
            </Flex>
          )}
          {claimlist?.length === 0 && !claimloading && <NoDataAvailable />}
        </Box>
        <>
          {claimloading && (
            <Flex flexDirection="column" gap="4">
              {[...Array(6)]?.map((_, i) => (
                <Skeleton height="20px" px="4" py="8" />
              ))}
            </Flex>
          )}
        </>
      </>
    );
  };
  
  export default ClaimList;
  