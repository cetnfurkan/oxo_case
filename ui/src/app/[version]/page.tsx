import Table from '@/components/Table';
import instance from '@/service/axios';

const header = ['ID', 'Variant', 'Type', 'Arch', 'Version', 'DPI'];

async function Versions({ version }: { version: string }) {
  const res = await instance.get(`/version/${version}`);
  const data = await res.data;
  
  return (
    <>
      {data?.variants?.map((version: any, index: number) => (
        <tr
          key={`version_${index}`}
          className="border-b dark:border-b-slate-500/30 hover:cursor-pointer hover:bg-slate-500/30"
        >
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version._id}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.variant}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.type}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.arch}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.version}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-white font-medium">
            {version.dpi}
          </td>
        </tr>
      ))}
    </>
  );
}

export default function Home({ params }: { params: { version: string } }) {
  return (
    <main className="container mx-auto">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <Table header={header}>
                <Versions version={params.version} />
              </Table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
