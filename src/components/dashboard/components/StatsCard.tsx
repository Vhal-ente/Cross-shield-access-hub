interface StatsCardProps {
    label: string;
    value: number;
  }
  
  const StatsCard = ({ label, value }: StatsCardProps) => {
    return (
      <div className="bg-neutral/50 rounded-lg shadow-md p-6 text-center">
        <h3 className="text-base font-medium text-neutral-800 mb-2">{label}</h3>
        <p className="text-base font-light text-neutral-800">{value}</p>
      </div>
    );
  };
  
  export default StatsCard;