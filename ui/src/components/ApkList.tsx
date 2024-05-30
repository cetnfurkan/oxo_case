'use client';
import moment from 'moment';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { Apk } from '../types';

interface ApkListProps {
  apks: Apk[];
  onDelete: Function;
}

const ApkList: React.FC<ApkListProps> = ({ apks, onDelete }) => {
  const [apkDetails, setApkDetails] = React.useState<Apk[]>(apks);

  const findAndDeleteApk = useCallback(
    async (id: string) => {
      await onDelete(id).then(() => {
        const updatedApks = apkDetails.filter((apk) => apk._id !== id);
        setApkDetails(updatedApks);
      });
    },
    [apkDetails, onDelete]
  );

  return (
    <>
      {apkDetails?.map((version: any, index: number) => (
        <tr
          key={`version_${index}`}
          className="border-b dark:border-b-slate-500/30 hover:cursor-pointer hover:bg-slate-500/30"
        >
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version._id}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.repo}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.version}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {moment(version.releaseDate).format('DD/MM/YYYY')}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.type}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.variants?.length || 0}
          </td>
          <td className="flex gap-3 items-center justify-center">
            <div
              onClick={() => findAndDeleteApk(version._id)}
              className="py-4 whitespace-nowrap text-white font-medium hover:text-blue-500 hover:underline text-center"
            >
              Delete
            </div>
            <Link
              href={`/${version._id}`}
              className="py-4 whitespace-nowrap text-white font-medium hover:text-blue-500 hover:underline text-center"
            >
              Show Details
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ApkList;
