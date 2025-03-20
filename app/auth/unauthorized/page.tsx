export default function UnauthorizedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-2xl font-bold mb-6">无权限访问</h1>
          <p className="text-gray-700">您没有权限访问此页面。</p>
        </div>
      </div>
    )
  }