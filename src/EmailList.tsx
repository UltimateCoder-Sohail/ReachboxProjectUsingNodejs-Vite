import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetchEmails ,classifyEmail ,generateReply } from './api';

type Email = {
  account: string;
  folder: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  text: string;
  html?: string;
  category?: string; // AI categorization
  reply?: string; // AI categorization
};

const columns = [
  {
    name: 'Subject',
    selector: (row: Email) => row.subject,
    sortable: true,
    wrap: true,
  },
  {
    name: 'From',
    selector: (row: Email) => row.from,
    sortable: true,
  },
  {
    name: 'To',
    selector: (row: Email) => row.to,
    sortable: true,
  },
  {
    name: 'Date',
    selector: (row: Email) => new Date(row.date).toLocaleString(),
    sortable: true,
  },
  {
    name: 'Text',
    selector: (row: Email) => row.text?.slice(0, 80) + '...',
    wrap: true,
  },
  {
    name: 'Category',
    selector: (row: Email) => row.category || 'Uncategorized',
    sortable: true,
    cell: (row: Email) => (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          row.category === 'Out of Office'
            ? 'bg-yellow-100 text-yellow-800'
            : row.category === 'Meeting'
            ? 'bg-blue-100 text-blue-800'
            : row.category === 'Spam'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {row.category || 'Uncategorized'}
      </span>
    ),
  },
   {
    name: 'Suggested Reply',
    selector: (row: Email) => row.reply || 'Uncategorized',
    sortable: true,
    cell: (row: Email) => (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          row.reply === 'Out of Office'
            ? 'bg-yellow-100 text-yellow-800'
            : row.reply === 'Meeting'
            ? 'bg-blue-100 text-blue-800'
            : row.reply === 'Spam'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {row.reply || 'Loading..'}
      </span>
    ),
  },
];

const EmailList = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [query, setQuery] = useState('');
  const [account, setAccount] = useState('');
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');

useEffect(() => {
  fetchEmails(query, account, to, from).then(setEmails);
}, [query, account, to, from]);

useEffect(() => {
  if (emails.length === 0) return;

  async function classifyAllEmails() {
    const classifiedEmails = await Promise.all(
      emails.map(async (email) => {
        const category = await classifyEmail(email.subject); // Or email.text
        const reply= await generateReply(email.subject);
        return { ...email, category , reply };
      })
    );
    
    setEmails(classifiedEmails);
  }

  classifyAllEmails();
}, [emails]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📧 Emails</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Search keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={emails}
        pagination
        highlightOnHover
        striped
        responsive
        dense
       defaultSortFieldId="date"

      />
    </div>
  );
};

export default EmailList;
