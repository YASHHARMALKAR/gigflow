import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGig, reset } from '../redux/slices/gigSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateGigPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
    });

    const { title, description, budget } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isSuccess, isError, message, isLoading } = useSelector((state) => state.gigs);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Gig posted successfully!');
            navigate('/');
        }
    }, [isSuccess, isError, message, navigate]);

    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createGig({ title, description, budget }));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Post a New Gig</h2>
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={onChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        required
                        value={description}
                        onChange={onChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget ($)</label>
                    <input
                        type="number"
                        name="budget"
                        id="budget"
                        required
                        value={budget}
                        onChange={onChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        {isLoading ? 'Posting...' : 'Post Gig'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateGigPage;
