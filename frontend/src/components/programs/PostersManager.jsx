import { useState, useEffect } from 'react';
import { assetsApi } from '../../api/assets.api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function PostersManager({ program, onUpdate }) {
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'editor']);
    const [assets, setAssets] = useState(program.assets || []);
    const [loading, setLoading] = useState(false);
    const [newAssetUrl, setNewAssetUrl] = useState('');
    const [addingTo, setAddingTo] = useState(null); // { language, variant }

    useEffect(() => {
        setAssets(program.assets || []);
    }, [program]);

    const variants = ['portrait', 'landscape', 'square', 'banner'];

    const getAsset = (lang, variant) => {
        return assets.find(
            (a) => a.language === lang && a.variant === variant && a.asset_type === 'poster'
        );
    };

    const handleAddAsset = async (lang, variant) => {
        if (!newAssetUrl.trim()) return;

        try {
            setLoading(true);
            const data = {
                program_id: program.id,
                language: lang,
                variant: variant,
                url: newAssetUrl,
            };
            const newAsset = await assetsApi.createProgramAsset(data);
            setAssets((prev) => [...prev, newAsset]);
            setAddingTo(null);
            setNewAssetUrl('');
            if (onUpdate) onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add asset');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAsset = async (id) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        try {
            setLoading(true);
            await assetsApi.deleteProgramAsset(id);
            setAssets((prev) => prev.filter((a) => a.id !== id));
            if (onUpdate) onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete asset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {program.languages_available.map((lang) => (
                <div key={lang} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {lang.toUpperCase()}
                            {lang === program.language_primary && (
                                <span className="text-xs ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    Primary
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {variants.map((variant) => {
                            const asset = getAsset(lang, variant);
                            const isRequired =
                                lang === program.language_primary &&
                                (variant === 'portrait' || variant === 'landscape');

                            return (
                                <div key={variant} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                            {variant} {isRequired && <span className="text-red-500">*</span>}
                                        </span>
                                    </div>

                                    {asset ? (
                                        <div className="relative group border border-gray-200 rounded-md overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={asset.url}
                                                alt={`${variant} poster`}
                                                className="w-full h-full object-cover"
                                            />
                                            {canEdit && (
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleDeleteAsset(asset.id)}
                                                    className="bg-white text-red-600 hover:text-red-700 text-xs px-2 py-1"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-300 transition-colors">
                                            {canEdit && addingTo?.language === lang && addingTo?.variant === variant ? (
                                                <div className="space-y-2">
                                                    <Input
                                                        placeholder="Image URL"
                                                        value={newAssetUrl}
                                                        onChange={(e) => setNewAssetUrl(e.target.value)}
                                                        className="text-xs"
                                                    />
                                                    <div className="flex gap-1 justify-center">
                                                        <Button
                                                            onClick={() => handleAddAsset(lang, variant)}
                                                            disabled={loading}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => {
                                                                setAddingTo(null);
                                                                setNewAssetUrl('');
                                                            }}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-2">
                                                    <p className="text-xs text-gray-500 mb-2">No image</p>
                                                    {canEdit && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setAddingTo({ language: lang, variant })}
                                                            className="text-xs w-full"
                                                        >
                                                            + Add
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
