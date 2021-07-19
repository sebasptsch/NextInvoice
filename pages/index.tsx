export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/invoices",
      permanent: false,
    },
  };
}

export default function Dashboard(props) {
  return <></>;
}
