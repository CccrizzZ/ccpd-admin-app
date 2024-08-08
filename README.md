# CCPD Admin App
Administration control console, full control over ccpd backend.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)


## Relation Graph
![workflow](https://github.com/CccrizzZ/ccpd-admin-app/blob/main/workflow.png)

## Pages

### Dashboard
```
- Periodic QA datas chart.
- Today's QA inventory live chart.
- Today's retail and return chart.
- SKU lookup tool (shows steped status & images & detailed info).
```

### Q&A Records
```
- Q&A inventory overview charts.
- Q&A Records Table.
    - Sorting and filtering function.
    - Pagination.
- Q&A records to instock inventory records conversion panel.
    - Scraping function panel.
    - Scraped first stock image can be compressed and uploaded into blob container.
    - Chat GPT text generation panel.
    - Adding tags function in submit panel.
- Problematic records panel:
    - Admin can set a record to problematic so the record shows up in this panel.
    - Check later ledger panel for problem records.
```

### Inventory
```
- Q&A Records component adds records to here, retail manager takes records from here.
- Inventory overview charts.
- Inventory table.
    - Filtering & Keyword search panel.
    - Edit and delete instock inventory records (edit mode).
- Inventory CSV export (filtered).
```

### User Management
```
- User data overview chart.
- Invitation code manager panel.
- Create custom user.
- Update and delete existing users.
```
