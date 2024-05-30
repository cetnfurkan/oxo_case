import ApkList from "@/components/ApkList";
import Table from "@/components/Table";
import instance from "@/service/axios";
import { Apk } from "@/types";

const header = ['ID', 'Repo', 'Version', 'Release Date', 'Type', 'Variants'];

async function deleteApk(id: string) : Promise<void> {
  "use server";
  
  await instance.delete(`/version/${id}`);

  return;
}

async function Versions() {
  "use server";

  const {data} : {data: Apk[]} = await instance.get(`/versions`);
  
  return (
    <>
      <ApkList apks={data} onDelete={deleteApk} />
    </>
  );
}

export default function Home() {
  return (
    <main className="container mx-auto">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <Table header={header}>
                <Versions />
              </Table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
