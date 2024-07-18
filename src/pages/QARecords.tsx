import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Grid,
  Badge,
  Col,
  Card,
  Title,
  Text,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  // BarChart,
  Subtitle,
} from '@tremor/react'
import {
  Condition,
  Platform,
  QARecord,
  QAQueryFilter,
  ScrapedData
} from '../utils/Types'
import { AppContext } from '../App'
import SearchPanel from '../components/SearchPanel'
import PaginationButton from '../components/PaginationButton'
import ProblemRecordsPanel, { IProblemRecordsPanel } from '../components/ProblemRecordsPanel'
import moment from 'moment'
import {
  FaRotate,
  FaArrowRightArrowLeft,
  FaArrowLeft,
  FaArrowRight,
  FaUpload,
  FaTrashCan,
  FaRotateLeft,
  FaRotateRight,
  FaXmark,
} from 'react-icons/fa6'
import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  initQARecord,
  server,
  getPlatformBadgeColor,
  renderItemConditionOptions,
  renderPlatformOptions,
  getConditionVariant,
  renderMarketPlaceOptions,
  openLink,
  initQAQueryFilter,
  extractHttpsFromStr,
  getKwArr,
  stringToNumber,
  isObjectsEqual,
  sleep
} from '../utils/utils'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import '../style/QARecords.css'
import TableFilter from '../components/TableFilter'
import PageItemStatsBox from '../components/PageItemStatsBox'
import ImageUploadModal from '../components/ImageUploadModal'
import InventoryRecordingModal from '../components/InventoryRecordingModal'
import { VscAzure } from "react-icons/vsc";
import { PropagateLoader } from 'react-spinners'
import DailyQAOverview from '../components/DailyQAOverview'
import ConfirmationModal from '../components/ConfirmationModal'
// import KeyboardAlert from '../components/KeyboardAlert'

const initScrapeData: ScrapedData = {
  title: '',
  msrp: 0,
  imgUrl: '',
  currency: ''
}

const QARecords: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  // reference to components
  const ProblemPanelRef = useRef<IProblemRecordsPanel>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  // recording panel
  const [QARecordArr, setQARecordArr] = useState<QARecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<QARecord>(initQARecord)
  const [originalSelectedRecord, setOriginalSelectedRecord] = useState<QARecord>(initQARecord)
  const [selectedRecordImagesArr, setSelectedRecordImagesArr] = useState<string[]>([])
  const [exchangeRate, setExchangeRate] = useState<number>(1.42)

  // image
  const [imagePopupUrl, setImagePopupUrl] = useState<string>('')
  const [imageRotationIndex, setImageRotationIndex] = useState<number>(0)
  const possibleRotations = [
    '',
    'rotate-90',
    'rotate-180',
    '-rotate-90',
  ]

  // flags
  const [displayProblemRecordsPanel, setDisplayProblemRecordsPanel] = useState<boolean>(false)
  const [showMarkConfirmPopup, setShowMarkConfirmPopup] = useState<boolean>(false)
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false)
  const [flipQACard, setFlipQACard] = useState<boolean>(false)
  const [changed, setChanged] = useState<boolean>(false)
  const [showUploadImagePopup, setShowUploadImagePopup] = useState<boolean>(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false)
  const [updateConfirmation, setUpdateConfirmation] = useState<boolean>(false)

  // paging and count
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(50)
  const [itemCount, setItemCount] = useState<number>(0)
  const [recordedCount, setRecordedCount] = useState<number>(0)
  const prevItemButtonRef = useRef<HTMLButtonElement>(null);
  const nextItemButtonRef = useRef<HTMLButtonElement>(null);

  // filtering
  const [queryFilter, setQueryFilter] = useState<QAQueryFilter>(initQAQueryFilter)

  // scraping and chat gpt
  const [scrapeData, setScrapeData] = useState<ScrapedData>(initScrapeData)
  const [isScraping, setIsScraping] = useState<boolean>(false)

  useEffect(() => {
    fetchQARecordsByPage()

    // keyboard event
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // keyboard event to navigate between records
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ']') {
      console.log('Go right')
      nextItemButtonRef.current?.click()
    } else if (e.key === '[') {
      console.log('Go left')
      prevItemButtonRef.current?.click()
    }
  }

  // reset scraped Amazon data
  const clearScrape = () => setScrapeData(initScrapeData)

  // total page according to the item number and per page count
  const getTotalPage = () => Math.ceil(itemCount / itemsPerPage) - 1

  // called on component mount
  const fetchQARecordsByPage = async (isInit?: boolean, newItemsPerPage?: number, skeyword?: string, sortingOption?: string) => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordsByPage',
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({
        page: isInit ? 0 : currPage,
        itemsPerPage: newItemsPerPage ?? itemsPerPage,
        filter: isInit ? initQAQueryFilter : { ...queryFilter, keywordFilter: skeyword ? getKwArr(skeyword) : [] },
        sortingOption: sortingOption ?? 'Time DESC'
      }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      setQARecordArr(data['arr'])
      setItemCount(data['count'])
      setRecordedCount(data['recorded'])
      if (changed) setChanged(false)
    }).catch((err: AxiosError) => {
      setQARecordArr([])
      setItemCount(0)
      setLoading(false)
      console.warn('Failed Fetching QA Records: ' + err.message)
    })
    setLoading(false)
  }

  // put record in problematic list
  const setRecordProblematic = async (sku: string, isProblematic: boolean) => {
    setShowMarkConfirmPopup(false)
    setLoading(true)
    await axios({
      method: 'patch',
      url: server + '/adminController/setProblematicBySku/' + sku,
      responseType: 'text',
      timeout: 8000,
      data: { 'isProblem': isProblematic },
      withCredentials: true
    }).then(() => {
      // refresh
    }).catch((err) => {
      setLoading(false)
      console.warn('Failed Fetching QA Records: ' + err.message)
    })
    setLoading(false)
    fetchQARecordsByPage()
    ProblemPanelRef.current?.fetchProblemRecords()
    setSelectedRecord(initQARecord)
  }

  // get image url from Azure Blob Storage
  const fetchImageUrlArr = async (sku?: string) => {
    setLoading(true)
    setSelectedRecordImagesArr([])
    await axios({
      method: 'post',
      url: server + '/imageController/getUrlsBySku',
      responseType: 'text',
      timeout: 8000,
      data: { 'sku': sku ?? String(selectedRecord.sku) },
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      setSelectedRecordImagesArr(JSON.parse(res.data))
    }).catch((err: AxiosError) => {
      console.log(err.response?.data)
      setLoading(false)
    })
    setLoading(false)
  }

  // fetch qa record by page number
  const pageAxios = async (newPage: number) => {
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordsByPage',
      responseType: 'text',
      timeout: 8000,
      data: {
        page: newPage,
        itemsPerPage: itemsPerPage,
        filter: queryFilter
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      if (data['arr'] && data['arr'].length > 0) {
        setQARecordArr(data['arr'])
        setCurrPage(newPage)
        setChanged(false)
      }
    }).catch((res: AxiosError) => {
      setLoading(false)
      console.warn('Cannot get page: ' + res.message)
    })
  }

  // for next and prev page button
  const fetchPage = async (direction: number) => {
    // direction for page turning
    let newPage = 0
    if (direction > 0) {
      if (currPage + 1 > getTotalPage()) return
      newPage = currPage + 1
    } else {
      if (currPage - 1 < 0) return
      newPage = currPage - 1
    }
    scrollToTable()
    setLoading(true)
    pageAxios(newPage)
    setLoading(false)
  }

  // jump to first or last page
  const gotoFirstLastPage = async (direction: number) => {
    // goto fist or last page
    let newPage = 0
    if (direction > 0) {
      if (currPage === getTotalPage()) return
      newPage = getTotalPage()
    } else {
      if (currPage === 0) return
      newPage = 0
    }
    scrollToTable()
    setLoading(true)
    pageAxios(newPage)
    setLoading(false)
  }

  // returns the selected item's index in QA record page array
  const getSelectedItemIndex = () => QARecordArr.findIndex(item => item.sku === selectedRecord.sku)

  // goto next record in page
  const nextRecord = () => {
    if (isScraping) return
    const next = QARecordArr[getSelectedItemIndex() + 1]
    if (!next) return
    setSelectedRecord(next)
    fetchImageUrlArr(String(next.sku))
    setOriginalSelectedRecord(next)

    clearScrape()
    // check if record have scraped data
    if (next.scrapedData) setScrapeData(next.scrapedData)
    // scrapeRequest(next.sku)
    fetchQARecordsByPage(false)
  }

  // goto previous record in page
  const prevRecord = () => {
    if (isScraping) return
    const prev = QARecordArr[getSelectedItemIndex() - 1]
    if (!prev) return
    setSelectedRecord(prev)
    fetchImageUrlArr(String(prev.sku))
    setOriginalSelectedRecord(prev)

    clearScrape()
    // check if record have scraped data
    if (prev.scrapedData) setScrapeData(prev.scrapedData)
    // scrapeRequest(prev.sku)
    fetchQARecordsByPage(false)
  }

  // scrape button function
  const scrapeRequest = async (sku: number) => {
    if (isScraping) return
    if (selectedRecord.platform !== 'Amazon') return
    setIsScraping(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/scrapeInfoBySkuAmazon',
      responseType: 'text',
      timeout: 12000,   // scraping takes longer time
      data: { 'sku': String(sku) },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data: ScrapedData = JSON.parse(res.data)
      // if not CAD, convert to CAD
      // if (data.currency !== 'CAD') data.msrp = toCad(data.msrp, data.currency) ?? data.msrp
      setScrapeData(data)
    }).catch((res: AxiosError) => {
      console.log('Failed Scraping: ' + res.message)
    })
    setIsScraping(false)
  }

  // take QA record scrape and generate info, then push data into instock inventory db
  const renderRecordingPanel = () => {
    const onConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedRecord({ ...selectedRecord, itemCondition: event.target.value as Condition })
    const onOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, ownerName: event.target.value })
    const onShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 5) setSelectedRecord({ ...selectedRecord, shelfLocation: event.target.value })
    }
    const onMarketplaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRecord({ ...selectedRecord, marketplace: event.target.value as Platform })
    }
    const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 3) setSelectedRecord({ ...selectedRecord, amount: Number(event.target.value) })
    }
    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 100) setSelectedRecord({ ...selectedRecord, comment: event.target.value })
    }
    const onLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, link: event.target.value })
    const onPlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedRecord({ ...selectedRecord, platform: event.target.value as Platform })
    const onRecordTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, time: event.target.value })
    const onExRateChange = (event: React.ChangeEvent<HTMLInputElement>) => setExchangeRate(stringToNumber(event.target.value))

    // close qa gallery image popup and reset the input
    const clearImagePopup = () => {
      setImagePopupUrl('')
      setShowImagePopup(false)
      setImageRotationIndex(0)
    }

    // full size image popup
    const renderImageModal = () => {
      // go to prev or next image
      const gotoImage = (pos: number) => {
        if (pos > 0) {
          const next = selectedRecordImagesArr[selectedRecordImagesArr.indexOf(imagePopupUrl) + 1]
          if (!next) return
          setImagePopupUrl(next)
        } else {
          const prev = selectedRecordImagesArr[selectedRecordImagesArr.indexOf(imagePopupUrl) - 1]
          if (!prev) return
          setImagePopupUrl(prev)
        }
      }

      // send delete requet to server
      const deleteImage = async () => {
        setLoading(true)
        await axios({
          method: 'delete',
          url: server + '/imageController/deleteImageByName',
          responseType: 'text',
          timeout: 8000,
          data: JSON.stringify({
            sku: selectedRecord.sku,
            name: imagePopupUrl.replace(/^.*[\\/]/, '')
          }),
          withCredentials: true
        }).then(async (res: AxiosResponse) => {
          if (res.status === 200) {
            alert('Image Deleted')
            await sleep(1000)
            fetchImageUrlArr()
          }
        }).catch((res: AxiosError) => {
          setLoading(false)
          console.warn(`Cannot Delete Image ${res.message}`)
        })
        setShowImagePopup(false)
        setLoading(false)
      }

      // move rotation index according to direction
      const rotateImage = async (direction: number) => {
        if (direction > 0) {
          if (imageRotationIndex === 3) {
            setImageRotationIndex(0)
          } else {
            setImageRotationIndex(imageRotationIndex + 1)
          }
        } else {
          if (imageRotationIndex === 0) {
            setImageRotationIndex(3)
          } else {
            setImageRotationIndex(imageRotationIndex - 1)
          }
        }
      }

      // send rotate image request to server
      const updateRotation = async () => {
        setLoading(true)
        await axios({
          method: 'post',
          url: server + '/imageController/rotateImage',
          responseType: 'text',
          timeout: 8000,
          data: JSON.stringify({
            sku: selectedRecord.sku,
            name: imagePopupUrl.replace(/^.*[\\/]/, ''),
            rotationIndex: imageRotationIndex
          }),
          withCredentials: true
        }).then((res: AxiosResponse) => {
          if (res.status === 200) {
            alert('Image Rotation Updated')
          }
        }).catch((res: AxiosError) => {
          console.warn(`Cannot Rotate Image ${res.response?.data}`)
          setLoading(false)
        })
        clearImagePopup()
        fetchImageUrlArr()
        setLoading(false)
      }

      return (
        <Modal
          show={showImagePopup}
          onHide={clearImagePopup}
          size='xl'
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title className='text-white font-bold'>{selectedRecord.sku}</Modal.Title>
            <p className='absolute text-rose-500 top-12 left-3'>{imagePopupUrl.replace(/^.*[\\/]/, '')}</p>
          </Modal.Header>
          <Modal.Body>
            <div className='min-h-96'>
              <Button className='absolute h-48 left-6 top-1/2 opacity-30 rounded-full' color='gray' onClick={() => gotoImage(-1)}>
                <FaArrowLeft />
              </Button>
              <img className={'m-auto mr-6 ml-6 ' + `${possibleRotations[imageRotationIndex]}`} src={imagePopupUrl} />
              <Button className='absolute h-48 right-6 top-1/2 opacity-30 rounded-full' color='gray' onClick={() => gotoImage(1)}>
                <FaArrowRight />
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className='absolute left-12' color='rose' onClick={deleteImage}>
              Delete Image
            </Button>
            {
              imageRotationIndex !== 0 ?
                <Button color='amber' className='absolute left-64' onClick={updateRotation}>
                  Update Image Rotation to Cloud
                </Button>
                : undefined
            }
            <div className='absolute right-64'>
              <Button color='indigo' onClick={() => rotateImage(-1)}>
                <FaRotateLeft />
              </Button>
              <Button color='indigo' onClick={() => rotateImage(1)}>
                <FaRotateRight />
              </Button>
            </div>
            <Button color='slate' onClick={clearImagePopup}>
              Close
            </Button>
            <Button color='emerald' onClick={() => openLink(imagePopupUrl)}>
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      )
    }

    // populate thumbnails gallery with url in url array
    const renderThumbnails = () => selectedRecordImagesArr.map((link: string) =>
      <img src={link} key={link} width={200} className='max-h-[300px]' onClick={() => { setShowImagePopup(true); setImagePopupUrl(link) }} />
    )

    // confirm model to set record problematic
    const renderConfirmModal = () => (
      <Modal
        show={showMarkConfirmPopup}
        onHide={() => setShowMarkConfirmPopup(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Record {selectedRecord.sku}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Set this record {selectedRecord.problem ? ' resolved' : ' problematic'}?
        </Modal.Body>
        <Modal.Footer>
          <Button color='slate' onClick={() => setShowMarkConfirmPopup(false)}>
            Close
          </Button>
          {
            selectedRecord.problem ?
              <Button color='lime' onClick={() => setRecordProblematic(String(selectedRecord.sku), false)}>Confirm</Button> :
              <Button color='red' onClick={() => setRecordProblematic(String(selectedRecord.sku), true)}>Confirm</Button>
          }
        </Modal.Footer>
      </Modal>
    )

    // selected QA record information card
    const renderQARecordCard = () => {
      // A side contains QA info
      const renderA = () => (
        <div className='min-h-[500px]'>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Admin</InputGroup.Text>
            <Form.Control style={{ color: 'orange' }} value={userInfo.name} readOnly disabled />
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Q&A Personal</InputGroup.Text>
            <Form.Control value={selectedRecord.ownerName} onChange={onOwnerChange} />
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Shelf Location</InputGroup.Text>
            <Form.Control value={selectedRecord.shelfLocation} onChange={onShelfLocationChange} />
          </InputGroup>
          <InputGroup size="sm" className="mb-3" >
            <InputGroup.Text>Item Condition</InputGroup.Text>
            <Form.Select value={selectedRecord.itemCondition} onChange={onConditionChange}>
              {renderItemConditionOptions()}
            </Form.Select>
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Original Platform</InputGroup.Text>
            <Form.Select value={selectedRecord.platform} onChange={onPlatformChange}>
              {renderPlatformOptions()}
            </Form.Select>
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Target Marketplace</InputGroup.Text>
            <Form.Select value={selectedRecord.marketplace} onChange={onMarketplaceChange}>
              {renderMarketPlaceOptions()}
            </Form.Select>
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Amount</InputGroup.Text>
            <Form.Control value={selectedRecord.amount} onChange={onAmountChange} />
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Comment</InputGroup.Text>
            <Form.Control
              className='resize-none h-32'
              as="textarea"
              value={selectedRecord.comment}
              onChange={onCommentChange}
            />
          </InputGroup>
          <InputGroup size="sm" className="mb-6">
            <InputGroup.Text>Link</InputGroup.Text>
            <Form.Control
              className='resize-none h-32'
              as="textarea"
              value={selectedRecord.link}
              onChange={onLinkChange}
            />
            <Button size='xs' color='slate' onClick={() => setSelectedRecord({ ...selectedRecord, link: extractHttpsFromStr(selectedRecord.link) })}>Extract</Button>
            <Button size='xs' color='gray' onClick={() => openLink(selectedRecord.link)}>Open</Button>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>QA Input Time</InputGroup.Text>
            <Form.Control value={selectedRecord.time} onChange={onRecordTimeChange} />
          </InputGroup>
        </div>
      )

      const onMsrpChange = (event: React.ChangeEvent<HTMLInputElement>) => setScrapeData({ ...scrapeData, msrp: stringToNumber(event.target.value) })
      const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => setScrapeData({ ...scrapeData, title: event.target.value })
      const onCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => setScrapeData({ ...scrapeData, currency: event.target.value })

      // push image to azure blob storage
      const pushImage = async () => {
        // send image url to server
        // server fetch from the url and push it into blob storage
        if (!scrapeData.imgUrl) return
        // setLoading(true)
        await axios({
          method: 'post',
          url: server + '/imageController/uploadScrapedImage',
          responseType: 'text',
          timeout: 12000,   // scraping takes longer time
          data: JSON.stringify({
            'sku': String(selectedRecord.sku),
            'owner': userInfo,
            'url': scrapeData.imgUrl
          }),
          withCredentials: true
        }).then((res: AxiosResponse) => {
          if (res.status === 200) {
            alert(`uploaded stock image for: ${selectedRecord.sku}`)
          }
        }).catch((res: AxiosError) => {
          alert('Failed Scraping: ' + res.response?.data)
        })
        // setLoading(false)
        fetchImageUrlArr()
      }

      // scraped data: msrp, title, first image
      // chatgpt data: lead, description
      // B side contains web scraper and chat gpt results
      const renderB = () => (
        <div className='min-h-[500px]'>
          <Badge color={getPlatformBadgeColor(selectedRecord.platform)}>{selectedRecord.platform}</Badge>
          {/* <div className='flex gap-2'>
            <a
              className='max-w-28'
              href={extractHttpsFromStr(selectedRecord.link)}
              target='_blank'
            >
              {extractHttpsFromStr(selectedRecord.link).slice(0, 100)}
            </a>
          </div> */}
          <InputGroup className='my-3'>
            <InputGroup.Text>URL</InputGroup.Text>
            <Form.Control
              value={selectedRecord.link}
              onChange={onLinkChange}
              as="textarea"
              className='resize-none h-32'
            />
            <Button size='xs' color='slate' onClick={() => setSelectedRecord({ ...selectedRecord, link: extractHttpsFromStr(selectedRecord.link) })}>Extract</Button>
            <Button size='xs' color='gray' onClick={() => openLink(selectedRecord.link)}>Open</Button>
          </InputGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Title</InputGroup.Text>
            <Form.Control
              className='resize-none h-32'
              as="textarea"
              value={scrapeData.title}
              onChange={onTitleChange}
            />
          </InputGroup>
          <Grid numItems={4}>
            <Col numColSpan={3}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text>Currency Type</InputGroup.Text>
                <Form.Control value={scrapeData.currency} onChange={onCurrencyChange} />
              </InputGroup>
            </Col>
            <Col numColSpan={1}>
              <Button className='ml-2' color='emerald' onClick={() => scrapeRequest(selectedRecord.sku)}>Scrape</Button>
            </Col>
          </Grid>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>MSRP</InputGroup.Text>
            <Form.Control
              value={scrapeData.msrp}
              onChange={onMsrpChange}
              type='number'
              step={0.01}
            />
            {scrapeData.currency !== 'CAD' && scrapeData.currency ?
              <>
                <InputGroup.Text>
                  <FaXmark />
                  {/* {scrapeData.currency === 'USD' ? `${(Number(scrapeData.msrp) / 1.3).toFixed(2)} USD x  ${usdToCadRate ?? 0} = ${Number(scrapeData.msrp) ?? 0} $CAD 🍁` : ''} */}
                </InputGroup.Text>
                <Form.Control
                  value={exchangeRate}
                  onChange={onExRateChange}
                  type='number'
                  step={0.01}
                />
                <InputGroup.Text>
                  <span className='text-amber-500'>
                    = {(scrapeData.msrp * exchangeRate).toFixed(2)} $CAD
                  </span>
                </InputGroup.Text>
              </>
              : <></>}
          </InputGroup>
          <hr />
          <p>First Stock Image:</p>
          <div className={`absolute top-0 left-0 text-center h-full w-full bg-black opacity-60 rounded-lg ${isScraping ? 'visible' : 'invisible'}`}>
            <PropagateLoader className='mt-[50%] ml-[50%]' color='#f97316' loading={isScraping} />
          </div>
          <img className='max-w-[300px]' src={scrapeData.imgUrl} />
          <hr />
          {scrapeData.imgUrl ? <Button className='p-8 mt-8 ml-2' color='indigo' onClick={pushImage}>Push to {selectedRecord.sku} Gallery 👉</Button> : undefined}
        </div>
      )

      return (
        <Card className='h-fit mb-12 !bg-[#223]'>
          {flipQACard ? renderB() : renderA()}
        </Card>
      )
    }

    return (
      <div className='h-full'>
        <div className='flex'>
          {renderImageModal()}
          {renderConfirmModal()}
          <div className='w-1/2 p-3 pt-0'>
            <div className='flex'>
              <h2 className={`mb-3 font-bold ${selectedRecord.problem ? 'text-red-500' : selectedRecord.recorded ? 'text-emerald-500' : ''}`} >
                {`${selectedRecord.recorded ? '✅' : ''}${selectedRecord.sku}`}
              </h2>
              <Button
                color='rose'
                className='absolute right-2/3 mt-2'
                onClick={() => setFlipQACard(!flipQACard)}
                tooltip='Flip Card'
              >
                <FaArrowRightArrowLeft />
                Flip to Back
              </Button>
            </div>
            {renderQARecordCard()}
          </div>
          <div className='w-1/2 mb-10'>
            <div className='flex'>
              <h2 className='flex'><VscAzure /> Photos Storage</h2>
              <Button
                className='absolute right-8 mt-2'
                color='indigo'
                tooltip='Fetch Photos'
                onClick={() => fetchImageUrlArr()}
              >
                <FaRotate />
              </Button>
              <Button
                className='absolute right-28 mt-2'
                color='emerald'
                tooltip='Upload Photos'
                onClick={() => setShowUploadImagePopup(true)}
              >
                <FaUpload />
              </Button>
            </div>
            <hr />
            <Card className='overflow-y-scroll inline-grid min-h-[520px] !bg-[#223]'>
              {selectedRecordImagesArr.length < 1 ? <Subtitle>Photos Uploaded By Q&A Personal Will Show Up Here</Subtitle> : <div className='grid grid-cols-3 gap-2'>{renderThumbnails()}</div>}
            </Card>
            <ImageUploadModal
              sku={selectedRecord.sku}
              show={showUploadImagePopup}
              handleClose={() => { setShowUploadImagePopup(false); fetchImageUrlArr() }}
              userInfo={userInfo}
            />
          </div>
        </div>
        <div className='w-full'>
          <InventoryRecordingModal
            record={selectedRecord}
            scrapeData={scrapeData}
            nextItem={nextRecord}
            exRate={exchangeRate}
          />
        </div>
        <div className='absolute bottom-3 w-full'>
          <Button ref={prevItemButtonRef} color='indigo' onClick={prevRecord}>Prev</Button>
          <Button className='ml-12' color={selectedRecord.problem ? 'lime' : 'rose'} onClick={() => setShowMarkConfirmPopup(true)}>{selectedRecord.problem ? 'Mark Resolved' : 'Mark Problem'}</Button>
          <Button ref={nextItemButtonRef} className='absolute right-12' color='indigo' onClick={nextRecord}>Next</Button>
        </div>
      </div>
    )
  }

  // set record panel cursor to show certain record
  const setSelectedRecordByRecord = async (record: QARecord) => {
    setSelectedRecord(record)
    setOriginalSelectedRecord(record)
    scrollToTop()
    setSelectedRecordImagesArr([])
    clearScrape()

    // fetch images
    setLoading(true)
    fetchImageUrlArr(String(record.sku))
    if (record.scrapedData) setScrapeData(record.scrapedData)
    setLoading(false)
  }

  const renderInventoryTableBody = () => (
    <TableBody>
      {QARecordArr?.map((record, index) => (
        <TableRow key={`${index} + ${record.sku}`}>
          <TableCell>
            <p className={'absolute left-3 text-lg ' + (record.sku === selectedRecord.sku ? 'visible' : 'invisible')}>👉</p>
            <Button
              className={'text-white'}
              color={record.recorded ? 'emerald' : 'zinc'}
              tooltip={record.problem ? 'This Record Have Problem' : record.recorded ? 'Already Recorded' : 'Not Recorded'}
              onClick={() => { clearScrape(); setSelectedRecordByRecord(record) }}
            >
              {record.sku}
            </Button>
          </TableCell>
          <TableCell>
            <Text>{record.ownerName}</Text>
          </TableCell>
          <TableCell>
            <Badge color='purple' className='font-bold'>{record.shelfLocation}</Badge>
          </TableCell>
          <TableCell>
            <Badge color={getConditionVariant(record.itemCondition)}>{record.itemCondition}</Badge>
          </TableCell>
          <TableCell>
            <p className='text-white-500'>{record.comment}</p>
          </TableCell>
          <TableCell>
            <p><a className='cursor-pointer' onClick={() => openLink(record.link)}>{record.link ? record.link.slice(0, 50) : ''}</a></p>
          </TableCell>
          <TableCell>
            <Badge color={getPlatformBadgeColor(record.platform)}>{record.platform}</Badge>
          </TableCell>
          <TableCell>
            <Badge color={getPlatformBadgeColor(record.marketplace ?? 'None')}>{record.marketplace}</Badge>
          </TableCell>
          <TableCell>
            <Text>{record.amount}</Text>
          </TableCell>
          <TableCell>
            <Text>{moment(record.time).format('LLL')}</Text>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )

  // scroll up to top of QA record table
  const scrollToTable = () => {
    if (tableRef.current) tableRef.current.scrollIntoView({
      behavior: 'instant'
    })
  }

  // scroll to top of the page
  const scrollToTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({
      behavior: 'instant'
    })
  }

  // QA table filter
  const renderFilter = () => {
    const resetFilters = () => {
      setQueryFilter(initQAQueryFilter)
      setCurrPage(0)
      setChanged(false)
      fetchQARecordsByPage(true)
    }

    return (
      <div className='flex mb-4'>
        <Button
          className='text-white absolute mt-4'
          color={changed ? 'amber' : 'emerald'}
          onClick={() => { fetchQARecordsByPage(false); setCurrPage(0) }}
          tooltip='Refresh QA Records Table'
        >
          <FaRotate />
        </Button>
        <TableFilter
          queryFilter={queryFilter}
          setQueryFilter={setQueryFilter}
          setChanged={setChanged}
          resetFilters={resetFilters}
          refresh={(searchKeyword: string) => { fetchQARecordsByPage(false, undefined, searchKeyword); setCurrPage(0) }}
        />
        <br />
        <br />
        <br />
        <PageItemStatsBox
          totalItems={itemCount}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
        />
        <div className='absolute right-10 top-24 text-center'>
          <label className='text-gray-500 mb-1'>Recorded</label>
          <h4 className='text-emerald-500'>{recordedCount}</h4>
        </div>
      </div>
    )
  }

  // if no QA record found in DB this will render
  const renderPlaceHolder = () => {
    if (!QARecordArr || !QARecordArr.length) return <h4 className='text-red-400 w-max ml-auto mr-auto mt-12 mb-12'>No Q&A Records Found!</h4>
  }

  // onchange function for items per page selection
  const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrPage(0)
    setItemsPerPage(Number(event.target.value))
    fetchQARecordsByPage(false, Number(event.target.value))
  }

  // update QA record in QA database
  const updateQARecord = async (sku: number) => {
    setLoading(true)
    if (isObjectsEqual(selectedRecord, originalSelectedRecord)) return alert('Cannot Submit Unchanged Record')
    await axios({
      method: 'put',
      url: `${server}/inventoryController/updateInventoryBySku/${String(sku)}`,
      responseType: 'text',
      timeout: 12000,
      withCredentials: true,
      data: JSON.stringify({ newInventoryInfo: selectedRecord }),
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`${res.data} ${sku}`)
        // setSelectedRecord(initQARecord)
        fetchQARecordsByPage(false)
      }
    }).catch((err: AxiosError) => {
      alert('Cannot update: ' + err.response?.data)
      setLoading(false)
    })
    setLoading(false)
  }

  // delete QA record from QA database
  const deleteQARecord = async (sku: number) => {
    await axios({
      method: 'delete',
      url: `${server}/adminController/deleteQARecordsBySku/${String(sku)}`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`${res.data} ${sku}`)
        setSelectedRecord(initQARecord)
        fetchQARecordsByPage(false)
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      console.warn('Cannot get page: ' + err.response?.data)
    })
  }

  // QA record manipulation buttons
  const renderOperationButtons = () => (
    <div className='absolute right-16 flex top-6 gap-2'>
      <Button color='rose' onClick={() => setDeleteConfirmation(true)}><FaTrashCan className='m-0' /></Button>
      <Button color='amber' onClick={() => setUpdateConfirmation(true)}>Update</Button>
      <Button color='emerald' onClick={() => setSelectedRecord(originalSelectedRecord)}>Reset</Button>
    </div>
  )

  return (
    <div ref={topRef}>
      <ConfirmationModal
        confirmAction={() => deleteQARecord(selectedRecord.sku)}
        show={deleteConfirmation}
        hide={() => setDeleteConfirmation(false)}
        title={`Confirm to Delete ${selectedRecord.sku}`}
        msg='You Cannot Undo Delete'
      />
      <ConfirmationModal
        confirmAction={() => updateQARecord(selectedRecord.sku)}
        show={updateConfirmation}
        hide={() => setUpdateConfirmation(false)}
        title={`Confirm to Update ${selectedRecord.sku}`}
        msg='You Could Reverse Updation Immediatley by Clicking "Reset" Button and "Update" Button Again'
      />
      {/* control panels */}
      <Grid className="gap-2" numItems={3}>
        <Col numColSpan={2}>
          <Card className="h-full">
            <Title>📥 Inventory Recording</Title>
            {selectedRecord.sku ? renderOperationButtons() : undefined}
            <hr />
            {selectedRecord.sku === 0 ? <Subtitle className='text-center mt-64'>Selected QA Records Details Will Be Shown Here!</Subtitle> : renderRecordingPanel()}
          </Card>
        </Col>
        <Col numColSpan={1} className='h-full'>
          <Card className="h-96">
            {/* <Button
              color='rose'
              className='right-6 absolute p-2'
              onClick={() => setDisplaySearchRecords(!displaySearchRecords)}
              tooltip='Flip Card'
            >
              <FaArrowRightArrowLeft />
            </Button> */}
            <SearchPanel setSelectedRecord={setSelectedRecordByRecord} />
            {/* {displaySearchRecords ?  : renderTopOverViewChart()} */}
          </Card>
          <Card className="min-h-96 mt-2">
            <Button
              color='rose'
              className='right-6 absolute p-2'
              onClick={() => setDisplayProblemRecordsPanel(!displayProblemRecordsPanel)}
              tooltip='Flip Card'
            >
              <FaArrowRightArrowLeft />
            </Button>
            {
              displayProblemRecordsPanel ?
                <ProblemRecordsPanel
                  ref={ProblemPanelRef}
                  setSelectedRecord={setSelectedRecordByRecord}
                  setSelectedRecordImagesArr={setSelectedRecordImagesArr}
                /> : <DailyQAOverview />
            }
          </Card>
        </Col>
      </Grid>
      {/* table */}
      <Card className='mt-2 max-w-full'>
        <div ref={tableRef}></div>
        {renderFilter()}
        <PaginationButton
          totalPage={getTotalPage()}
          currentPage={currPage}
          nextPage={() => fetchPage(1)}
          prevPage={() => fetchPage(-1)}
          firstPage={() => gotoFirstLastPage(-1)}
          lastPage={() => gotoFirstLastPage(1)}
        />
        <hr />
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell className='w-36'>Owner</TableHeaderCell>
              <TableHeaderCell className='w-36'>Shelf Location</TableHeaderCell>
              <TableHeaderCell className='w-36'>Condition</TableHeaderCell>
              <TableHeaderCell className='w-64'>Comment</TableHeaderCell>
              <TableHeaderCell>Link</TableHeaderCell>
              <TableHeaderCell>Platform</TableHeaderCell>
              <TableHeaderCell>Marketplace</TableHeaderCell>
              <TableHeaderCell className='w-36'>Amount</TableHeaderCell>
              <TableHeaderCell className='w-[130px]'>Time Created</TableHeaderCell>
            </TableRow>
          </TableHead>
          {renderInventoryTableBody()}
        </Table>
        {/* p cannot be a child of table */}
        {renderPlaceHolder()}
        <hr />
        <PaginationButton
          totalPage={getTotalPage()}
          currentPage={currPage}
          nextPage={() => fetchPage(1)}
          prevPage={() => fetchPage(-1)}
          firstPage={() => gotoFirstLastPage(-1)}
          lastPage={() => gotoFirstLastPage(1)}
        />
      </Card>
    </div>
  )
}
export default QARecords
